from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

admin.site.site_header = "Al-Firdaus Institute & Mosque Digital Platform"
admin.site.site_title = "Al-Firdaus Admin Portal"
admin.site.index_title = "Management Dashboard & System Analytics"

urlpatterns = [
    path("admin/", admin.site.urls),
    # OpenAPI Schema & Swagger UI routes
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui-docs"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # App API routes
    path("api/auth/", include("accounts.urls")),
    path("api/prayer-times/", include("prayer_times.urls")),
    path("api/donations/", include("donations.urls")),
    path("api/events/", include("events.urls")),
    path("api/khutbahs/", include("khutbahs.urls")),
    path("api/announcements/", include("announcements.urls")),
    path("api/institute/", include("institute.urls")),
    path("api/mosque-info/", include("mosque_info.urls")),
]


