from django.db import models


class Course(models.Model):
    CATEGORY_CHOICES = [
        ("quran", "Quran & Tajweed"),
        ("arabic", "Arabic Language"),
        ("islamic_studies", "Islamic Studies"),
        ("hifdh", "Hifdh Program"),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES, default="quran")
    description = models.TextField()
    age_group = models.CharField(max_length=64, default="All Ages")
    schedule = models.CharField(max_length=128, blank=True)
    instructor = models.CharField(max_length=128, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_featured", "title"]

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"


class CourseRegistration(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("contacted", "Contacted"),
        ("enrolled", "Enrolled"),
    ]

    course = models.ForeignKey(Course, related_name="registrations", on_delete=models.CASCADE)
    full_name = models.CharField(max_length=128)
    phone = models.CharField(max_length=32)
    email = models.EmailField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} - {self.course.title}"
