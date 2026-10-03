from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Event, RSVP


class RSVPInline(TabularInline):
    model = RSVP
    extra = 0
    readonly_fields = ("name", "phone", "created_at")
    can_delete = True


@admin.register(Event)
class EventAdmin(ModelAdmin):
    list_display = ("title", "event_date", "location", "rsvp_count", "is_active", "created_at")
    list_filter = ("is_active", "event_date", "location")
    search_fields = ("title", "description", "location")
    inlines = [RSVPInline]


@admin.register(RSVP)
class RSVPAdmin(ModelAdmin):
    list_display = ("name", "phone", "event", "created_at")
    list_filter = ("event", "created_at")
    search_fields = ("name", "phone", "event__title")
