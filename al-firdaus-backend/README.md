# Al Firdaus Backend API

Django REST Framework backend for Al Firdaus Institute & Mosque. Provides REST API endpoints for prayer times, donations, events, user management, and more. Runs on PostgreSQL with automatic prayer time calculations and comprehensive audit logging.

## Quick Start

```bash
# Clone repository
git clone https://github.com/Denis-Kingston/al-firdaus-backend.git
cd al-firdaus-backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with configuration
cp .env.example .env
# Edit .env with your database and email credentials

# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Generate prayer times for next 12 months
python manage.py generate_prayer_times

# Start development server
python manage.py runserver
```

Backend now running at `http://localhost:8000`

## Project Structure

```
al-firdaus-backend/
├── manage.py                    # Django management script
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
├── firdaus/                     # Main Django project settings
│   ├── settings.py              # Django configuration
│   ├── urls.py                  # URL routing
│   ├── wsgi.py                  # WSGI for production
│   └── asgi.py                  # ASGI for websockets
├── users/                       # User management app
│   ├── models.py                # User model, roles, permissions
│   ├── serializers.py           # User serializers
│   ├── views.py                 # Authentication endpoints
│   ├── permissions.py           # Role-based access control
│   └── urls.py                  # /api/users/* endpoints
├── prayer_times/                # Prayer times management
│   ├── models.py                # PrayerTime model
│   ├── views.py                 # Prayer time endpoints
│   ├── management/
│   │   └── commands/
│   │       └── generate_prayer_times.py
│   └── urls.py                  # /api/prayer-times/* endpoints
├── donations/                   # Donation & payment handling
│   ├── models.py                # Donation, RecurringDonation models
│   ├── serializers.py           # Donation serializers
│   ├── views.py                 # Donation endpoints
│   ├── payments.py              # Selcom integration
│   ├── receipt.py               # PDF receipt generation
│   └── urls.py                  # /api/donations/* endpoints
├── events/                      # Event & RSVP management
│   ├── models.py                # Event, RSVP models
│   ├── serializers.py           # Event serializers
│   ├── views.py                 # Event endpoints
│   └── urls.py                  # /api/events/* endpoints
├── khutbahs/                    # Sermon/Khutbah management
│   ├── models.py                # Khutbah model
│   ├── serializers.py           # Khutbah serializers
│   ├── views.py                 # Khutbah endpoints
│   └── urls.py                  # /api/khutbahs/* endpoints
├── announcements/               # Announcement management
│   ├── models.py                # Announcement model
│   ├── serializers.py           # Announcement serializers
│   ├── views.py                 # Announcement endpoints
│   └── urls.py                  # /api/announcements/* endpoints
├── audit_logs/                  # Compliance & audit logging
│   ├── models.py                # AuditLog model
│   ├── middleware.py            # Auto-logging middleware
│   └── views.py                 # Audit log endpoints
├── templates/                   # Django email templates
│   ├── password_reset_email.html
│   └── donation_receipt_email.html
└── README.md                    # This file
```

## Environment Setup

Create `.env` file in project root:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/al_firdaus
DEBUG=True

# Django
SECRET_KEY=generate-a-long-random-string-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Email (Gmail example - use app-specific password)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Selcom (Payments)
SELCOM_API_KEY=sandbox-key
SELCOM_API_SECRET=sandbox-secret
SELCOM_MERCHANT_CODE=merchant-code

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=firebase-admin@project.iam.gserviceaccount.com

# CORS (Origins allowed to call this API)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# API URLs
API_BASE_URL=http://localhost:8000
WEBSITE_URL=http://localhost:3000
```

## API Endpoints

### Authentication

```
POST   /api/auth/login/          - Login with email/password
POST   /api/auth/logout/         - Logout (token invalidation)
POST   /api/auth/password-reset/ - Request password reset email
POST   /api/auth/password-confirm/ - Confirm new password
POST   /api/auth/refresh/        - Refresh authentication token
GET    /api/auth/profile/        - Get current user profile
PUT    /api/auth/profile/        - Update current user profile
```

### Prayer Times

```
GET    /api/prayer-times/                 - List all prayer times
GET    /api/prayer-times/?date=2026-09-08 - Get for specific date
GET    /api/prayer-times/<id>/            - Get specific entry
POST   /api/prayer-times/                 - Create (admin only)
PUT    /api/prayer-times/<id>/            - Update (admin only)
DELETE /api/prayer-times/<id>/            - Delete (admin only)
```

**Response Example:**
```json
{
  "id": 1,
  "date": "2026-09-08",
  "fajr": "05:30",
  "dhuhr": "12:15",
  "asr": "15:45",
  "maghrib": "18:20",
  "isha": "19:45",
  "islamic_date": "15 Safar 1448"
}
```

### Donations

```
POST   /api/donations/              - Create new donation
GET    /api/donations/              - List donations
GET    /api/donations/<id>/         - Get specific donation
GET    /api/donations/<id>/receipt/ - Download PDF receipt
POST   /api/donations/webhook/      - Selcom payment webhook
GET    /api/donations/analytics/    - Donation stats (admin)
```

### Events

```
GET    /api/events/                - List all events
POST   /api/events/                - Create event (admin only)
GET    /api/events/<id>/           - Get specific event
PUT    /api/events/<id>/           - Update event (admin only)
DELETE /api/events/<id>/           - Delete event (admin only)
POST   /api/events/<id>/rsvps/     - RSVP to event
GET    /api/events/<id>/rsvps/     - Get RSVPs for event
```

### Khutbahs (Sermons)

```
GET    /api/khutbahs/              - List all sermons
POST   /api/khutbahs/              - Create sermon (admin only)
GET    /api/khutbahs/<id>/         - Get specific sermon
PUT    /api/khutbahs/<id>/         - Update sermon (admin only)
```

### Announcements

```
GET    /api/announcements/          - List announcements
POST   /api/announcements/          - Create (admin only)
GET    /api/announcements/<id>/     - Get specific
PUT    /api/announcements/<id>/     - Update (admin only)
DELETE /api/announcements/<id>/     - Delete (admin only)
```

### Audit Logs (Admin Only)

```
GET    /api/audit-logs/             - List audit logs
GET    /api/audit-logs/?user=<id>   - Filter by user
GET    /api/audit-logs/?action=CREATE - Filter by action
```

## Features

### 1. Authentication & Authorization
- Token-based authentication
- Role-based access control (RBAC):
  - **Admin:** Full system access
  - **User:** Personal data only
  - **Public:** Read-only access

### 2. Prayer Times
- Auto-calculated using Islamic calendar algorithms
- Pre-calculated for 12 months
- Updates automatically

### 3. Donations & Payments
- Integration with Selcom (Tanzanian payment gateway)
- Sandbox mode for testing, live mode for production
- PDF receipt generation
- Webhook support for payment confirmation
- Recurring donation intent tracking

### 4. Events Management
- Create, update, delete events
- RSVP tracking with attendee count
- Capacity limits

### 5. Audit Logging
- Every action logged automatically
- User & timestamp tracking
- Action type logging
- For ISO compliance

### 6. Email Integration
- Password reset emails
- Donation confirmation emails
- Configurable via .env

### 7. Firebase Integration
- Push notifications for:
  - Prayer time reminders
  - Event announcements
  - New khutbahs

## Testing

### Run Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users

# Run with coverage report
coverage run --source='.' manage.py test
coverage report
```

## Deployment

### Deploy to Render

1. **Connect GitHub Repository**
   - Go to render.com
   - Select this repository
   - Authorize access

2. **Configure Web Service**
   - Environment: Python 3.10
   - Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - Start Command: `gunicorn firdaus.wsgi:application`

3. **Add PostgreSQL Database**
   - Create managed PostgreSQL in Render
   - Copy DATABASE_URL to web service env vars

4. **Set Environment Variables**
   - Add all from .env file to Render dashboard
   - Ensure DEBUG=False in production

5. **Run Initial Setup**
   - Via Render shell:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py generate_prayer_times
   ```

### Production Checklist

- [ ] DEBUG = False
- [ ] SECRET_KEY is long random string
- [ ] ALLOWED_HOSTS updated
- [ ] DATABASE_URL uses PostgreSQL
- [ ] Email credentials set (real SMTP)
- [ ] CORS_ALLOWED_ORIGINS updated
- [ ] SSL certificate (automatic on Render)
- [ ] Database backups enabled
- [ ] Error tracking enabled (Sentry)
- [ ] Admin password changed
- [ ] Selcom real account (not sandbox)
- [ ] Firebase credentials configured

## Troubleshooting

### Database Connection Error

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
python manage.py dbshell
```

### Email Not Sending

```bash
# Test SMTP in Django shell
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Test', 'from@example.com', ['to@example.com'])
```

### Prayer Times Not Showing

```bash
# Check if generated
python manage.py shell
>>> from prayer_times.models import PrayerTime
>>> PrayerTime.objects.count()

# Generate if empty
python manage.py generate_prayer_times
```

## Security Considerations

1. **Secrets Management**
   - Never commit .env to Git
   - Use separate .env for production
   - Rotate secrets regularly

2. **SQL Injection Prevention**
   - Use Django ORM (parameterized queries)
   - Never use string formatting for SQL

3. **CORS Configuration**
   - Whitelist only trusted origins
   - Review before going live

4. **Rate Limiting**
   - Consider for public endpoints
   - Prevent donation endpoint spam

5. **HTTPS Enforcement**
   - Render provides SSL automatically
   - Set SECURE_SSL_REDIRECT = True in production

## Support & Contributing

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: deogratiusdiu123@gmail.com

---

**Last Updated:** September 2026  
**Maintained by:** SoftNet Technologies Limited
