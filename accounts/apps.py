from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        from django.contrib import admin
        admin.site.site_header = "Al Firdaus Institute & Mosque — Admin"
        admin.site.site_title = "Al Firdaus Admin"
        admin.site.index_title = "Management Console"