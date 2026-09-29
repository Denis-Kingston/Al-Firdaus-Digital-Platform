from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class AlFirdausUserAdmin(UserAdmin):
    list_display = ("username", "full_name_display", "role", "is_active", "last_login")
    list_filter = ("role", "is_active")
    fieldsets = UserAdmin.fieldsets + (
        ("Al Firdaus role", {"fields": ("role", "phone")}),
    )

    def full_name_display(self, obj):
        return obj.get_full_name()
    full_name_display.short_description = "Name"