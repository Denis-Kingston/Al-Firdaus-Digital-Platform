from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.TextChoices):
    SUPER_ADMIN = "super_admin", "Super Admin"
    CONTENT_EDITOR = "content_editor", "Content Editor"
    FINANCE_MANAGER = "finance_manager", "Finance Manager"
    ADMISSIONS = "admissions", "Admissions"
    VIEWER = "viewer", "Viewer"


class User(AbstractUser):
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.VIEWER)
    phone = models.CharField(max_length=32, blank=True)

    @property
    def is_super_admin(self):
        return self.role == Role.SUPER_ADMIN or self.is_superuser

    @property
    def can_manage_content(self):
        return self.role in {Role.SUPER_ADMIN, Role.CONTENT_EDITOR} or self.is_superuser

    @property
    def can_manage_finance(self):
        return self.role in {Role.SUPER_ADMIN, Role.FINANCE_MANAGER} or self.is_superuser

    @property
    def can_manage_admissions(self):
        return self.role in {Role.SUPER_ADMIN, Role.ADMISSIONS} or self.is_superuser

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ("CREATE", "Create"),
        ("READ", "Read"),
        ("UPDATE", "Update"),
        ("DELETE", "Delete"),
        ("LOGIN", "Login"),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=16, choices=ACTION_CHOICES)
    resource = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"

    def __str__(self):
        return f"[{self.action}] {self.resource} by {self.user or 'Anonymous'} at {self.timestamp}"