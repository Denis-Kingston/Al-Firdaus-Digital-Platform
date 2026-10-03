from django.db import models


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255, default="Al Firdaus Mosque")
    event_date = models.DateTimeField()
    rsvp_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class RSVP(models.Model):
    event = models.ForeignKey(Event, related_name="rsvps", on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    phone = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.event.title}"
