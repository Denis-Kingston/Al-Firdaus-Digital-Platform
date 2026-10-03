from django.conf import settings
from django.db import models


class Announcement(models.Model):
    CATEGORY_CHOICES = [
        ("general", "General"),
        ("event", "Event"),
        ("prayer", "Prayer"),
        ("urgent", "Urgent Notice"),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES, default="general")
    is_urgent = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="announcements"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_urgent", "-created_at"]

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"
