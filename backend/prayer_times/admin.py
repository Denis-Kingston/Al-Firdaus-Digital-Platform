from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import PrayerTime


@admin.register(PrayerTime)
class PrayerTimeAdmin(ModelAdmin):
    list_display = ("date", "hijri_date", "fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha")
    list_filter = ("date",)
    search_fields = ("date", "hijri_date")
    ordering = ("date",)
