from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ContactMessage, Facility, SiteSetting, SiteStat, Teacher


@admin.register(Teacher)
class TeacherAdmin(ModelAdmin):
    list_display = ("name", "title", "specialty", "order", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "title", "bio", "specialty")
    list_editable = ("order", "is_active")


@admin.register(Facility)
class FacilityAdmin(ModelAdmin):
    list_display = ("title", "capacity", "icon", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    list_editable = ("order", "is_active")


@admin.register(SiteStat)
class SiteStatAdmin(ModelAdmin):
    list_display = ("label", "value", "icon", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("label", "value")
    list_editable = ("order", "is_active")


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ("name", "email", "phone", "subject", "message_preview", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "phone", "subject", "message")
    list_editable = ("is_read",)
    readonly_fields = ("name", "email", "phone", "subject", "message_content_box", "created_at")
    fields = ("name", "email", "phone", "subject", "message_content_box", "is_read", "created_at")
    actions = ["mark_as_read", "mark_as_unread"]

    @admin.display(description="Message Text / Ujumbe")
    def message_preview(self, obj):
        if not obj.message:
            return "-"
        preview = obj.message if len(obj.message) <= 60 else f"{obj.message[:60]}..."
        return preview

    @admin.display(description="Full Message Content")
    def message_content_box(self, obj):
        from django.utils.html import format_html
        return format_html(
            '<div style="background:#0f172a; color:#f8fafc; padding:1.25rem 1.5rem; '
            'border-radius:0.75rem; border-left:4px solid #10b981; font-size:1rem; '
            'line-height:1.7; white-space:pre-wrap; max-width:850px; font-family:ui-sans-serif, system-ui, sans-serif;">'
            '{}</div>',
            obj.message or "(No message content)"
        )

    @admin.action(description="Mark selected messages as Read")
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)

    @admin.action(description="Mark selected messages as Unread")
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)


@admin.register(SiteSetting)
class SiteSettingAdmin(ModelAdmin):
    list_display = ("site_name", "phone", "email", "address", "updated_at")
