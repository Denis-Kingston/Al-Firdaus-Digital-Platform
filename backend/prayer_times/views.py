from datetime import date
from rest_framework import generics, response, status
from rest_framework.views import APIView
from .models import PrayerTime
from .serializers import PrayerTimeSerializer


class PrayerTimeListView(generics.ListAPIView):
    queryset = PrayerTime.objects.all()
    serializer_class = PrayerTimeSerializer


class TodayPrayerTimeView(APIView):
    def get(self, request):
        today = date.today()
        prayer_time = PrayerTime.objects.filter(date=today).first()
        if not prayer_time:
            # Fallback mock for today if not generated in DB yet
            data = {
                "date": str(today),
                "hijri_date": "18 Rabi' al-Thani 1448 AH",
                "fajr": "04:45",
                "sunrise": "06:00",
                "dhuhr": "12:30",
                "asr": "15:45",
                "maghrib": "18:20",
                "isha": "19:30",
            }
            return response.Response(data)
        serializer = PrayerTimeSerializer(prayer_time)
        return response.Response(serializer.data)
