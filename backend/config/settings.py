import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-al-firdaus-dev-key-change-in-production")

DEBUG = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1,127.0.0.1:8000,testserver,*").split(",")

INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party apps
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    # Local apps
    "accounts",
    "prayer_times",
    "donations",
    "events",
    "khutbahs",
    "announcements",
    "institute",
    "mosque_info",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Dar_es_Salaam"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOW_ALL_ORIGINS = DEBUG

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_THROTTLING_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "200/hour",
        "user": "1000/hour",
    },
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Al Firdaus Digital Platform API",
    "DESCRIPTION": "Interactive OpenAPI documentation & Swagger UI for testing API endpoints.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

from django.urls import reverse_lazy

UNFOLD = {
    "SITE_TITLE": "Al-Firdaus Admin Portal",
    "SITE_HEADER": "Al-Firdaus Institute & Mosque",
    "SITE_SUBHEADER": "Digital Management Platform",
    "SITE_SYMBOL": "mosque",
    "SHOW_HISTORY": True,
    "SHOW_LANGUAGES": False,
    "DASHBOARD_CALLBACK": "config.dashboard.dashboard_callback",
    "COLORS": {
        "primary": {
            "50": "236 253 245",
            "100": "209 250 229",
            "200": "167 243 208",
            "300": "110 231 183",
            "400": "52 211 153",
            "500": "16 185 129",
            "600": "5 150 105",
            "700": "4 120 87",
            "800": "6 95 70",
            "900": "6 78 59",
            "950": "2 44 34",
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Finance & Donations",
                "separator": True,
                "items": [
                    {
                        "title": "Causes / Funds",
                        "icon": "volunteer_activism",
                        "link": reverse_lazy("admin:donations_cause_changelist"),
                    },
                    {
                        "title": "Donations",
                        "icon": "payments",
                        "link": reverse_lazy("admin:donations_donation_changelist"),
                    },
                ],
            },
            {
                "title": "Institute & Education",
                "separator": True,
                "items": [
                    {
                        "title": "Courses",
                        "icon": "school",
                        "link": reverse_lazy("admin:institute_course_changelist"),
                    },
                    {
                        "title": "Registrations",
                        "icon": "how_to_reg",
                        "link": reverse_lazy("admin:institute_courseregistration_changelist"),
                    },
                ],
            },
            {
                "title": "Mosque & Content",
                "separator": True,
                "items": [
                    {
                        "title": "Announcements",
                        "icon": "campaign",
                        "link": reverse_lazy("admin:announcements_announcement_changelist"),
                    },
                    {
                        "title": "Events Calendar",
                        "icon": "event",
                        "link": reverse_lazy("admin:events_event_changelist"),
                    },
                    {
                        "title": "Event RSVPs / Attendees",
                        "icon": "how_to_reg",
                        "link": reverse_lazy("admin:events_rsvp_changelist"),
                    },
                    {
                        "title": "Khutbah Archive",
                        "icon": "record_voice_over",
                        "link": reverse_lazy("admin:khutbahs_khutbah_changelist"),
                    },
                    {
                        "title": "Prayer Times",
                        "icon": "schedule",
                        "link": reverse_lazy("admin:prayer_times_prayertime_changelist"),
                    },
                    {
                        "title": "Teachers & Imams",
                        "icon": "group",
                        "link": reverse_lazy("admin:mosque_info_teacher_changelist"),
                    },
                    {
                        "title": "Facilities",
                        "icon": "location_city",
                        "link": reverse_lazy("admin:mosque_info_facility_changelist"),
                    },
                    {
                        "title": "Impact Stats",
                        "icon": "query_stats",
                        "link": reverse_lazy("admin:mosque_info_sitestat_changelist"),
                    },
                    {
                        "title": "Contact Messages",
                        "icon": "mail",
                        "link": reverse_lazy("admin:mosque_info_contactmessage_changelist"),
                    },
                    {
                        "title": "Site Settings",
                        "icon": "settings",
                        "link": reverse_lazy("admin:mosque_info_sitesetting_changelist"),
                    },
                ],
            },
            {
                "title": "Users & Security",
                "separator": True,
                "items": [
                    {
                        "title": "User Accounts",
                        "icon": "people",
                        "link": reverse_lazy("admin:accounts_user_changelist"),
                    },
                    {
                        "title": "Audit Logs",
                        "icon": "security",
                        "link": reverse_lazy("admin:accounts_auditlog_changelist"),
                    },
                ],
            },
        ],
    },
}

