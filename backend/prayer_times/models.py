from django.db import models


class PrayerTime(models.Model):
    date = models.DateField(unique=True)
    hijri_date = models.CharField(max_length=128, blank=True)
    fajr = models.CharField(max_length=16)
    sunrise = models.CharField(max_length=16)
    dhuhr = models.CharField(max_length=16)
    asr = models.CharField(max_length=16)
    maghrib = models.CharField(max_length=16)
    isha = models.CharField(max_length=16)

    class Meta:
        ordering = ["date"]
        verbose_name = "Prayer Time"
        verbose_name_plural = "Prayer Times"

    def __str__(self):
        return f"Prayer Times for {self.date}"
