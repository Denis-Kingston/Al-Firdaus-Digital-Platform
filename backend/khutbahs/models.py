from django.db import models


class Khutbah(models.Model):
    title = models.CharField(max_length=255)
    speaker = models.CharField(max_length=128)
    date = models.DateField()
    audio = models.FileField(upload_to="khutbahs/", blank=True, null=True)
    summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.title} - {self.speaker}"
