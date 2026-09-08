# Al Firdaus Complete Build Guide

Step-by-step instructions to build, run, deploy, and maintain every component of the Al Firdaus Digital Platform.

## Table of Contents

1. [Part 1: Prerequisites](#part-1-prerequisites)
2. [Part 2: Backend Setup](#part-2-backend-setup)
3. [Part 3: Website Setup](#part-3-website-setup)
4. [Part 4: Mobile App (Flutter)](#part-4-mobile-app-flutter)
5. [Part 5: Deployment](#part-5-deployment)
6. [Part 6: Post-Launch Maintenance](#part-6-post-launch-maintenance)

---

## Part 1: Prerequisites

### System Requirements

**For Backend:**
- Python 3.10+
- PostgreSQL 12+
- pip (Python package manager)
- Virtual environment tool (venv or conda)

**For Website:**
- Any text editor (VS Code, Sublime, etc.)
- Web browser (Chrome, Firefox, Safari, Edge)
- Git

**For Mobile App:**
- Flutter SDK (latest stable)
- Android Studio (for Android) or Xcode (for iOS)
- Emulator or physical device

### Required Accounts

Before starting, create accounts for:
1. **GitHub** - for repositories
2. **Render** - for backend hosting (free tier available)
3. **Cloudflare** - for website hosting (free tier available)
4. **Firebase** - for push notifications (free tier available)
5. **Selcom** - for payment integration (sandbox account for testing)
6. **SMTP provider** - for email (Gmail, SendGrid, or similar)

### Install Git

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# Download from https://git-scm.com/download/win
```

Verify installation:
```bash
git --version
```

---

## Part 2: Backend Setup

### Step 1: Clone the Backend Repository

```bash
git clone https://github.com/Denis-Kingston/al-firdaus-backend.git
cd al-firdaus-backend
```

### Step 2: Create and Activate Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/al_firdaus

# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Selcom (Payments)
SELCOM_API_KEY=sandbox-key-from-selcom
SELCOM_API_SECRET=sandbox-secret-from-selcom
SELCOM_MERCHANT_CODE=merchant-code

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=firebase-admin@project.iam.gserviceaccount.com

# CORS Settings (for local development)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# API URLs
API_BASE_URL=http://localhost:8000
WEBSITE_URL=http://localhost:3000
```

### Step 5: Set Up PostgreSQL Database

```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Windows
# Download from https://www.postgresql.org/download/windows/
# Follow installer prompts
```

Create database:

```bash
createdb al_firdaus
```

### Step 6: Run Database Migrations

```bash
python manage.py migrate
```

### Step 7: Create Superuser Account

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### Step 8: Generate Prayer Times

```bash
python manage.py generate_prayer_times
```

This pre-calculates prayer times for the next 12 months and stores them in the database.

### Step 9: Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### Step 10: Run Development Server

```bash
python manage.py runserver
```

Backend is now running at `http://localhost:8000`

**Test it:**
```bash
curl http://localhost:8000/api/prayer-times/
```

---

## Part 3: Website Setup

### Step 1: Clone the Website Repository

```bash
git clone https://github.com/Denis-Kingston/al-firdaus-website.git
cd al-firdaus-website
```

### Step 2: Configure API Base URL

Edit `js/main.js` and find the `API_BASE` constant (near top of file):

```javascript
// For local development:
const API_BASE = 'http://localhost:8000/api';

// For production (update during deployment):
const API_BASE = 'https://your-production-api.com/api';
```

### Step 3: Start Local Web Server

**Option A: Using Python (built-in)**
```bash
python -m http.server 3000
```

**Option B: Using Node.js http-server**
```bash
npm install -g http-server
http-server -p 3000
```

**Option C: Using VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"

Website is now running at `http://localhost:3000`

### Step 4: Test Website Features

- [ ] Visit home page - prayer times should load
- [ ] Toggle language (EN/Swahili)
- [ ] Click "Find Qibla" - should request location permission
- [ ] Click "Zakat Calculator" - should work offline
- [ ] Visit "Events" - should fetch from API
- [ ] Try "Make a Donation" - Selcom button should appear (sandbox mode)

### Step 5: Enable PWA (Progressive Web App)

The website includes a service worker for offline support. To test:

1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Service Workers" section
4. Should see "sw.js" registered
5. Close browser, open website again - should load from cache

---

## Part 4: Mobile App (Flutter)

### Step 1: Install Flutter

```bash
# Download from https://flutter.dev/docs/get-started/install
# Or use Homebrew on macOS
brew install flutter

# Verify installation
flutter doctor
```

### Step 2: Clone the Mobile Repository

If the Flutter code exists in the backend repo:

```bash
# Navigate to Flutter app directory
cd al-firdaus-backend/flutter_app
```

Or if it's a separate repo (when created):

```bash
git clone https://github.com/Denis-Kingston/al-firdaus-mobile.git
cd al-firdaus-mobile
```

### Step 3: Install Dependencies

```bash
flutter pub get
```

### Step 4: Configure API Endpoint

Edit `lib/config/constants.dart`:

```dart
class ApiConstants {
  // For local development:
  static const String API_BASE_URL = 'http://localhost:8000/api';
  
  // For production:
  // static const String API_BASE_URL = 'https://your-production-api.com/api';
  
  static const String FIREBASE_PROJECT_ID = 'your-firebase-project';
}
```

### Step 5: Run on Emulator or Device

```bash
# List available devices
flutter devices

# Run on emulator
flutter run

# Run on specific device
flutter run -d <device-id>

# Run with hot reload enabled (default)
flutter run
```

### Step 6: Build for Release

**Android:**
```bash
flutter build apk --release
# Output: build/app/outputs/flutter-app.apk
```

**iOS:**
```bash
flutter build ios --release
# Then use Xcode to build the .ipa file
```

---

## Part 5: Deployment

### Pre-Deployment Checklist

- [ ] Backend repo pushed to GitHub
- [ ] Website repo pushed to GitHub
- [ ] All environment variables configured
- [ ] Database backups created
- [ ] Real SMTP credentials obtained
- [ ] Real Selcom credentials obtained (not sandbox)
- [ ] Firebase project created
- [ ] SSL certificates ready (if using custom domain)

### Deploy Backend to Render

**Step 1: Connect Repository**
1. Go to [https://render.com](https://render.com)
2. Sign up / Log in
3. Click "New +" → "Web Service"
4. Select GitHub repository `al-firdaus-backend`
5. Authorize GitHub access

**Step 2: Configure Render Web Service**

| Setting | Value |
|---------|-------|
| Name | `al-firdaus-backend` |
| Environment | `Python 3.10` |
| Build Command | `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput` |
| Start Command | `gunicorn firdaus.wsgi:application` |
| Plan | Free (or paid for production) |

**Step 3: Add Environment Variables**

In Render dashboard, add environment variables:

```
DATABASE_URL=postgresql://[user]:[password]@[host]/[db]
DEBUG=False
SECRET_KEY=[generate-strong-random-string]
ALLOWED_HOSTS=your-render-url.onrender.com
EMAIL_HOST_USER=[your-email]
EMAIL_HOST_PASSWORD=[your-app-password]
SELCOM_API_KEY=[real-selcom-key]
SELCOM_API_SECRET=[real-selcom-secret]
FIREBASE_PROJECT_ID=[firebase-project]
FIREBASE_PRIVATE_KEY=[firebase-key]
CORS_ALLOWED_ORIGINS=https://your-website-url.com
```

**Step 4: Add PostgreSQL Database**

1. In Render, click "New +" → "PostgreSQL"
2. Create database (free tier available)
3. Render will provide `DATABASE_URL` - copy to web service env vars
4. Trigger a redeploy

**Step 5: Run Initial Setup**

Once deployed, run one-time commands:

```bash
# Via Render dashboard → Shell in web service
python manage.py migrate
python manage.py createsuperuser
python manage.py generate_prayer_times
```

**Backend is now live!** Note the URL: `https://your-render-url.onrender.com`

### Deploy Website to Cloudflare Pages

**Step 1: Connect Repository**
1. Go to [https://pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign in with Cloudflare account
3. Click "Create a project" → "Connect to Git"
4. Select GitHub repository `al-firdaus-website`
5. Authorize access

**Step 2: Configure Build Settings**

| Setting | Value |
|---------|-------|
| Framework preset | `None` (static site) |
| Build command | (leave empty) |
| Build output directory | (leave empty) |

**Step 3: Set Environment Variables** (if needed)

Skip for now - static site needs no build vars.

**Step 4: Deploy**

1. Click "Save and Deploy"
2. Cloudflare auto-deploys from `main` branch
3. Get your site URL: `https://al-firdaus-website.pages.dev`

**Step 5: Update Backend CORS Settings**

In Render dashboard, update environment variable:

```
CORS_ALLOWED_ORIGINS=https://al-firdaus-website.pages.dev
```

Trigger redeploy.

**Step 6: Update Website API URL**

In `al-firdaus-website/js/main.js`:

```javascript
const API_BASE = 'https://your-render-url.onrender.com/api';
```

Push to GitHub - Cloudflare auto-deploys.

### Deploy Mobile App to App Stores

**Google Play Store:**
1. Create Play Console account
2. Create new application
3. Build signed APK: `flutter build apk --release`
4. Upload APK to Play Console
5. Fill metadata, screenshots, description
6. Submit for review (~2-3 hours)

**Apple App Store:**
1. Create Apple Developer account
2. Create new app in App Store Connect
3. Build iOS app: `flutter build ios --release`
4. Use Xcode to upload to App Store
5. Submit for review (~1-2 days)

### Update DNS (Custom Domain)

If using custom domain (e.g., `al-firdaus-mosque.tz`):

**For Website (Cloudflare Pages):**
1. In Cloudflare, add CNAME record:
   - Name: `www` (or @)
   - Target: `al-firdaus-website.pages.dev`
2. SSL automatically provisioned

**For Backend (Render):**
1. Add CNAME record:
   - Name: `api`
   - Target: `[your-render-url].onrender.com`
2. Update Render → Environment Variables → ALLOWED_HOSTS
3. SSL automatically provisioned

---

## Part 6: Post-Launch Maintenance

### Daily Tasks
- [ ] Monitor Render logs for errors
- [ ] Check Cloudflare analytics
- [ ] Verify prayer times are updating correctly

### Weekly Tasks
- [ ] Review audit logs in Django admin
- [ ] Test donation flow (use test Selcom card)
- [ ] Check email delivery (password reset)
- [ ] Monitor error tracking (Sentry if enabled)

### Monthly Tasks
- [ ] Database backup (Render automatic, but verify)
- [ ] Update Django security patches: `pip list --outdated`
- [ ] Review Selcom transaction reports
- [ ] Test mobile app with latest content

### Quarterly Tasks
- [ ] Review system architecture for scaling needs
- [ ] Plan feature releases
- [ ] Update documentation

### Setting Up Monitoring

**Sentry (Error Tracking)**
```bash
pip install sentry-sdk

# Add to Django settings.py
import sentry_sdk
sentry_sdk.init(dsn="https://your-sentry-dsn@sentry.io/project-id")
```

**Uptime Monitoring**
- Sign up at https://uptimerobot.com
- Add monitors for:
  - `https://your-render-url.onrender.com/health/`
  - `https://your-website-url.pages.dev/`
- Set alerts to email

**Log Aggregation**
- Render logs available in dashboard
- Export to external service if needed (Datadog, LogRocket, etc.)

---

## Troubleshooting

### Backend Won't Start
```bash
# Check PostgreSQL is running
psql -l

# Check database URL in .env
python manage.py shell
>>> from django.conf import settings
>>> print(settings.DATABASES['default']['ENGINE'])

# Run migrations if not done
python manage.py migrate

# Check for syntax errors
python manage.py check
```

### Website API Calls Failing
- Open browser DevTools (F12) → Console
- Check for CORS errors
- Verify `API_BASE` URL in `main.js`
- Ensure backend is running and accessible
- Check Render logs for 500 errors

### Mobile App Won't Run
```bash
# Clean build
flutter clean
flutter pub get
flutter run

# Update Flutter
flutter upgrade

# Check device is connected
flutter devices

# Run with verbose output
flutter run -v
```

### Prayer Times Not Showing
```bash
# Verify prayer times in database
python manage.py shell
>>> from firdaus.models import PrayerTime
>>> PrayerTime.objects.count()  # Should be > 0

# Regenerate if empty
python manage.py generate_prayer_times
```

### Email Not Sending
```bash
# Test SMTP in Django shell
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Test message', 'from@example.com', ['to@example.com'])

# Check .env variables match your email provider
# Gmail requires app-specific password (not main password)
```

### Donations Stuck in "Pending"
- Check Selcom webhook configuration in Django settings
- Verify Selcom credentials are correct (not sandbox when live)
- Check Django logs for webhook errors

---

## Quick Reference Commands

```bash
# Backend
cd al-firdaus-backend
source venv/bin/activate
python manage.py runserver

# Website (in separate terminal)
cd al-firdaus-website
python -m http.server 3000

# Mobile
cd al-firdaus-mobile
flutter run

# Database commands
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
python manage.py generate_prayer_times
python manage.py shell

# Deployment
git push origin main  # Auto-deploys to Cloudflare & Render
```

---

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Maintained by:** Deogratius Diu & SoftNet Technologies Limited
