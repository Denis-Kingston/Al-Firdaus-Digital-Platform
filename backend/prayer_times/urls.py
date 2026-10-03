from django.urls import path
from .views import PrayerTimeListView, TodayPrayerTimeView

urlpatterns = [
    path("today/", TodayPrayerTimeView.as_view(), name="prayer-times-today"),
    path("", PrayerTimeListView.as_view(), name="prayer-times-list"),
]
