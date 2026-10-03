from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Course, CourseRegistration


@admin.register(Course)
class CourseAdmin(ModelAdmin):
    list_display = ("title", "category", "age_group", "instructor", "is_featured", "is_active", "created_at")
    list_filter = ("category", "is_featured", "is_active", "created_at")
    search_fields = ("title", "description", "instructor")


@admin.register(CourseRegistration)
class CourseRegistrationAdmin(ModelAdmin):
    list_display = ("full_name", "course", "phone", "email", "status", "created_at")
    list_filter = ("status", "course", "created_at")
    search_fields = ("full_name", "phone", "email", "notes")
