from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from .models import AuditLog, User


@admin.register(User)
class AlFirdausUserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

    list_display = ("username", "full_name_display", "role", "is_active", "last_login")
    list_filter = ("role", "is_active")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Al Firdaus role", {"fields": ("role", "phone")}),
    )

    def full_name_display(self, obj):
        return obj.get_full_name()
    full_name_display.short_description = "Name"


@admin.register(AuditLog)
class AuditLogAdmin(ModelAdmin):
    list_display = ("timestamp", "user", "action", "resource", "ip_address")
    list_filter = ("action", "timestamp")
    search_fields = ("resource", "details", "user__username", "user__email", "ip_address")
    readonly_fields = ("timestamp", "user", "action", "resource", "details", "ip_address")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser