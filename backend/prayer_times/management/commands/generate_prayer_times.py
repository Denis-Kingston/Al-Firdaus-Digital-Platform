from datetime import date, timedelta
from django.core.management.base import BaseCommand
from prayer_times.models import PrayerTime


class Command(BaseCommand):
    help = "Generate prayer times for the current year"

    def handle(self, *args, **kwargs):
        start_date = date.today()
        created_count = 0
        for i in range(365):
            current_date = start_date + timedelta(days=i)
            obj, created = PrayerTime.objects.get_or_create(
                date=current_date,
                defaults={
                    "hijri_date": f"{current_date.strftime('%d %b %Y')} (AH)",
                    "fajr": "04:45",
                    "sunrise": "06:00",
                    "dhuhr": "12:30",
                    "asr": "15:45",
                    "maghrib": "18:20",
                    "isha": "19:30",
                },
            )
            if created:
                created_count += 1
        self.stdout.write(self.style.SUCCESS(f"Successfully generated {created_count} prayer times records."))
