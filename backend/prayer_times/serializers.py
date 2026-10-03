from rest_framework import serializers
from .models import PrayerTime


class PrayerTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrayerTime
        fields = ["id", "date", "hijri_date", "fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]
