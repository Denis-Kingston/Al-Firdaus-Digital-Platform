from django.db import models


class Teacher(models.Model):
    name = models.CharField(max_length=128)
    title = models.CharField(max_length=128, help_text="e.g. Chief Imam, Resident Scholar, Quran Instructor")
    bio = models.TextField(blank=True)
    photo_url = models.CharField(max_length=512, blank=True, help_text="URL of teacher photo or leave empty for default avatar")
    specialty = models.CharField(max_length=128, default="Islamic Studies & Quran")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Teacher / Imam"
        verbose_name_plural = "Teachers & Imams"

    def __str__(self):
        return f"{self.name} - {self.title}"


class Facility(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField()
    icon = models.CharField(max_length=64, default="fas fa-mosque", help_text="FontAwesome icon class e.g. 'fas fa-book-quran'")
    capacity = models.CharField(max_length=64, blank=True, help_text="e.g. 2,500 Worshipers")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "title"]
        verbose_name = "Mosque Facility"
        verbose_name_plural = "Mosque Facilities"

    def __str__(self):
        return self.title


class SiteStat(models.Model):
    label = models.CharField(max_length=128, help_text="e.g. Daily Worshipers")
    value = models.CharField(max_length=64, help_text="e.g. 2,500+")
    icon = models.CharField(max_length=64, default="fas fa-users")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "label"]
        verbose_name = "Site & Impact Stat"
        verbose_name_plural = "Site & Impact Stats"

    def __str__(self):
        return f"{self.label}: {self.value}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=128)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"Message from {self.name}: {self.subject}"


class SiteSetting(models.Model):
    site_name = models.CharField(max_length=128, default="Al-Firdaus Digital Center")
    phone = models.CharField(max_length=32, default="+255 700 000 000")
    email = models.EmailField(default="info@al-firdaus.org")
    address = models.CharField(max_length=255, default="Kijitonyama, Dar es Salaam, Tanzania")
    about_text = models.TextField(default="Al-Firdaus Digital Platform offers comprehensive Islamic services, prayer schedules, institute education, khutbah archives, and community support.")
    facebook_url = models.URLField(blank=True, default="https://facebook.com")
    youtube_url = models.URLField(blank=True, default="https://youtube.com")
    instagram_url = models.URLField(blank=True, default="https://instagram.com")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.site_name
