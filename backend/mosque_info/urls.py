from django.urls import path
from .views import (
    ContactMessageCreateView,
    FacilityListView,
    SiteSettingDetailView,
    SiteStatListView,
    TeacherListView,
)

urlpatterns = [
    path("teachers/", TeacherListView.as_view(), name="teacher-list"),
    path("facilities/", FacilityListView.as_view(), name="facility-list"),
    path("stats/", SiteStatListView.as_view(), name="stat-list"),
    path("contact/", ContactMessageCreateView.as_view(), name="contact-create"),
    path("settings/", SiteSettingDetailView.as_view(), name="site-settings"),
]
