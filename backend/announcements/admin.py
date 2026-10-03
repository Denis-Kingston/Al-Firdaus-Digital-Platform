from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Announcement


@admin.register(Announcement)
class AnnouncementAdmin(ModelAdmin):
    list_display = ("title", "category", "is_urgent", "is_active", "author", "created_at")
    list_filter = ("category", "is_urgent", "is_active", "created_at")
    search_fields = ("title", "content")
    ordering = ("-created_at",)
