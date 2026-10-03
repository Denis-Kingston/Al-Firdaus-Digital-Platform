from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Khutbah


@admin.register(Khutbah)
class KhutbahAdmin(ModelAdmin):
    list_display = ("title", "speaker", "date", "created_at")
    list_filter = ("date", "speaker")
    search_fields = ("title", "speaker", "summary")
    ordering = ("-date",)
