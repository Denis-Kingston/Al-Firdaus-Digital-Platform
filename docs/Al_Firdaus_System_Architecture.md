# Al Firdaus System Architecture

Complete system architecture, design decisions, and data flow for the Al Firdaus Institute & Mosque digital platform.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Public Users                             │
└─────────────┬──────────────────┬────────��─────────┬──────────────┘
              │                  │                  │
              ▼                  ▼                  ▼
        ┌──────────────┐  ┌─────────────┐   ┌──────────────┐
        │   Website    │  │Admin Panel  │   │ Mobile App   │
        │  (HTML/CSS/  │  │  (Django    │   │  (Flutter)   │
        │     JS)      │  │   Admin)    │   │              │
        └──────────────┘  └─────────────┘   └──────────────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │   Cloudflare Pages       │
                    │   (Static hosting +      │
                    │    reverse proxy)        │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────────────────┐
                    │   Django REST API                    │
                    │   (Render - Web Service)            │
                    │   ├─ Authentication & Authorization │
                    │   ├─ Prayer Times Management        │
                    │   ├─ Donations & Payments           │
                    │   ├─ Events & RSVPs                 │
                    │   ├─ Khutbah Archive                │
                    │   └─ Audit Logging                  │
                    └────────────┬─────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
        │ PostgreSQL  │  │ Selcom       │  │ Email        │
        │ Database    │  │ (Payments)   │  │ (SMTP)       │
        │ (Render)    │  │              │  │ Password     │
        └─────────────┘  └──────────────┘  │ Resets       │
                                           └──────────────┘
                                                 │
                                           ┌─────▼──────┐
                                           │  Firebase  │
                                           │  (Push     │
                                           │  Notif.)   │
                                           └────────────┘
```

## Architecture Layers

### 1. Presentation Layer

#### Website (al-firdaus-website)
- **Technology:** Plain HTML, CSS, JavaScript (no build step)
- **Hosted on:** Cloudflare Pages
- **Features:**
  - Home page with mosque information
  - Prayer times display (fetched from backend API)
  - Qibla finder (calculated using geolocation)
  - Zakat calculator (offline, client-side)
  - Islamic learning resources library
  - Events calendar
  - Donations page (Selcom integration)
  - Announcements feed
  - About & Contact pages
  - Language toggle (English/Swahili)
  - Progressive Web App (PWA) support

#### Admin Dashboard
- **Technology:** Django Admin interface + custom views
- **Access:** Secure login with password reset via email
- **Features:**
  - Donation analytics and reports
  - Event management (CRUD)
  - Announcement management
  - User management
  - PDF receipt generation for donations
  - Audit log viewer

#### Mobile App (Flutter)
- **Technology:** Flutter (iOS & Android)
- **Status:** Code complete, UI mockups ready, awaiting compilation
- **Features:** Mirror website functionality with native mobile UX
- **Notifications:** Firebase Cloud Messaging (FCM) integration for push notifications

### 2. API Layer

#### Django REST Framework Backend (al-firdaus-backend)
- **Technology:** Django 4.x + Django REST Framework + PostgreSQL
- **Hosted on:** Render (Web Service)
- **Core Responsibilities:**
  - User authentication (token-based)
  - Role-based access control (RBAC)
  - Prayer times calculation and storage
  - Donation processing and receipts
  - Event management and RSVP tracking
  - Khutbah (sermon) archive
  - Audit logging for compliance

**Key Endpoints:**
```
POST   /api/auth/login/           - User authentication
POST   /api/auth/password-reset/  - Password reset
GET    /api/prayer-times/         - Fetch prayer schedule
POST   /api/donations/            - Create donation record
GET    /api/donations/            - List donations (admin)
POST   /api/events/               - Create events
GET    /api/events/               - List events
POST   /api/events/<id>/rsvps/    - RSVP to event
GET    /api/khutbahs/             - Sermon archive
GET    /api/announcements/        - Fetch announcements
POST   /api/announcements/        - Create announcements (admin)
```

### 3. Data Layer

#### PostgreSQL Database
- **Hosted on:** Render (managed PostgreSQL)
- **Purpose:** Single source of truth for all system data
- **Key Tables:**
  - `users` - User accounts with roles
  - `prayer_times` - Pre-calculated daily prayer times
  - `donations` - Donation records with status and PDF receipt paths
  - `events` - Mosque events and activities
  - `event_rsvps` - Attendance confirmations
  - `khutbahs` - Sermon archive with dates and summaries
  - `announcements` - Community notices and updates
  - `audit_logs` - System activity tracking for compliance
  - `recurring_donations` - Monthly giving intent records

**Note:** Recurring donations are stored, but re-charge scheduling still requires implementation once Selcom goes live.

### 4. External Integrations

#### Selcom (Payment Processing)
- **Status:** Code-complete, running in sandbox mode
- **Purpose:** Process donations via Tanzanian payment gateway
- **Prerequisite:** Real Selcom merchant account for live payments
- **Flow:**
  1. User initiates donation on website
  2. Request sent to Django backend
  3. Backend calls Selcom API
  4. Selcom redirects user for payment
  5. Payment confirmation webhook received
  6. Donation record updated in database
  7. PDF receipt generated

#### Email (SMTP)
- **Purpose:** Password resets and transactional emails
- **Requires:** Real SMTP credentials before going live
- **Templates:** Django email backend

#### Firebase Cloud Messaging (FCM)
- **Purpose:** Push notifications for:
  - Prayer time reminders
  - Event announcements
  - New khutbahs
  - Donation confirmations
- **Integration:** Firebase Admin SDK in Django backend

## Data Flow Examples

### Prayer Times Retrieval
```
User visits website
       ↓
JavaScript calls GET /api/prayer-times/
       ↓
Django API queries PostgreSQL
       ↓
Returns prayer times for current date
       ↓
Website displays times (formatted for EN/Swahili)
```

### Donation Flow
```
User fills donation form (website)
       ↓
POST to /api/donations/ with amount & name
       ↓
Django backend validates and creates donation record (status: pending)
       ↓
Backend calls Selcom API with donation details
       ↓
Selcom returns payment URL
       ↓
User redirected to Selcom for payment
       ↓
Selcom webhook sent to backend with payment confirmation
       ↓
Donation status updated to: completed
       ↓
PDF receipt generated
       ↓
Email sent to donor (if email provided)
       ↓
Donation appears in admin dashboard analytics
```

### Event RSVP Flow
```
User clicks "Attend" on event
       ↓
POST to /api/events/<id>/rsvps/
       ↓
Django creates RSVP record with user & event ID
       ↓
Firebase notification sent to admin
       ↓
Admin dashboard shows updated attendance count
```

## Security & Compliance

### Authentication
- Token-based authentication (JWT or Django Tokens)
- Password reset via email (no plaintext storage)
- Superuser account for initial setup

### Authorization (RBAC)
- **Admin role:** Full access to dashboard and Django admin
- **User role:** View-only on personal donations and events
- **Public:** Read-only access to prayer times, announcements, events, khutbahs

### Audit Logging
- Every API action logged with:
  - User ID & timestamp
  - Action type (CREATE, READ, UPDATE, DELETE)
  - Resource affected
  - IP address & user agent
- Stored in `audit_logs` table for compliance

### CORS & CSRF
- `CORS_ALLOWED_ORIGINS` whitelist in Django settings
- Must be updated during deployment to live website URL
- CSRF token validation for state-changing requests

## Deployment Architecture

### Development Environment
- Local Django runserver + SQLite
- Local static files (no build step)

### Staging (Optional)
- Render free tier or similar
- Test Selcom sandbox
- Test email configuration

### Production
```
┌─────────────┐
│ al-firdaus- │
│ website     │
└──────┬──────┘
       │ Git push
       │
       ▼
   Cloudflare Pages
   (auto-deploy on push)
   
┌─────────────┐
│ al-firdaus- │
│ backend     │
└──────┬──────┘
       │ Git push
       │
       ▼
   Render Web Service
   (auto-deploy on push)
   + PostgreSQL
```

## Key Design Decisions & Trade-offs

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **No build step for website** | Faster development, easier deployment, lower hosting cost | No npm packages, must write vanilla JS |
| **Single Django backend** | One database, no duplication, easier maintenance | Must support multiple clients (web, admin, mobile) |
| **Cloudflare Pages + Render** | Free tier available, good performance, built-in CI/CD | Potential vendor lock-in |
| **PostgreSQL over SQLite** | Supports concurrent users, better for production | Extra complexity in local setup |
| **Firebase only for notifications** | Lightweight, no SMS cost | Limited to push only; SMS requires separate service |
| **Selcom integration** | Local payment processor (Tanzania) | Sandbox-only until merchant account acquired |
| **Django Admin instead of custom dashboard** | Fast to build, built-in CRUD, user management | Less polished UI, limited customization |

## Scalability Considerations

### Current Capacity
- Single Render web dyno: ~100 concurrent users
- PostgreSQL free tier: sufficient for first 10k donations/events

### Scaling Path (if needed)
1. Upgrade Render plan (horizontal scaling with Procfile workers)
2. Add Redis for caching prayer times (rarely changes)
3. Add CDN caching headers on static website files
4. Split admin dashboard to separate backend service
5. Database read replicas for reporting queries

## Monitoring & Maintenance

### Recommended Tools
- **Error tracking:** Sentry (free tier available)
- **Uptime monitoring:** Uptime Robot or similar
- **Logging:** Render logs + Cloudflare analytics
- **Database backups:** Render automatic backups (daily)

### Regular Tasks
- Review audit logs weekly
- Test donation flow in sandbox monthly
- Backup database before major changes
- Update Django security patches as released

---

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Maintained by:** Deogratius Diu & SoftNet Technologies Limited
