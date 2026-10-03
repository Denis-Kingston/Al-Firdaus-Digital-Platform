from django.contrib import admin
from django.db.models import Sum
from django.utils.html import format_html
from unfold.admin import ModelAdmin
from .models import Cause, Donation


@admin.register(Cause)
class CauseAdmin(ModelAdmin):
    list_display = ("title", "target_amount_display", "total_raised_display", "progress_display", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "description")

    def target_amount_display(self, obj):
        return f"{obj.target_amount:,.2f} TZS"
    target_amount_display.short_description = "Target Amount"

    def total_raised_display(self, obj):
        return f"{obj.total_raised:,.2f} TZS"
    total_raised_display.short_description = "Total Raised"

    def progress_display(self, obj):
        percent = obj.progress_percent
        width_pct = min(max(0, percent), 100)
        color = "#2d6a4f" if percent >= 100 else "#d97706"
        pct_text = f"{percent:.0f}%"
        width_text = f"{width_pct:.0f}"
        return format_html(
            '<div style="width: 100px; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">'
            '<div style="width: {}%; background-color: {}; height: 16px; text-align: center; color: white; font-size: 10px; font-weight: bold; line-height: 16px;">{}</div>'
            '</div>',
            width_text,
            color,
            pct_text,
        )
    progress_display.short_description = "Progress"


@admin.register(Donation)
class DonationAdmin(ModelAdmin):
    list_display = (
        "reference",
        "donor_name",
        "donor_phone",
        "amount_display",
        "cause",
        "status_badge",
        "payment_method",
        "created_at",
        "receipt_download_link",
    )
    list_filter = ("status", "payment_method", "created_at", "cause")
    search_fields = ("reference", "donor_name", "donor_phone", "donor_email", "selcom_order_id")
    ordering = ("-created_at",)
    readonly_fields = ("reference", "selcom_order_id", "created_at", "updated_at")

    def amount_display(self, obj):
        formatted_amount = f"{int(obj.amount):,} TZS"
        return format_html("<b>{}</b>", formatted_amount)
    amount_display.short_description = "Amount"

    def status_badge(self, obj):
        colors_map = {
            "completed": ("#dcfce7", "#15803d", "COMPLETED"),
            "pending": ("#fef3c7", "#b45309", "PENDING"),
            "failed": ("#fee2e2", "#b91c1c", "FAILED"),
        }
        bg, fg, label = colors_map.get(obj.status, ("#f3f4f6", "#374151", obj.status.upper()))
        return format_html(
            '<span style="background-color: {}; color: {}; padding: 4px 8px; border-radius: 12px; font-weight: bold; font-size: 11px;">{}</span>',
            bg,
            fg,
            label,
        )
    status_badge.short_description = "Status"

    def receipt_download_link(self, obj):
        url = f"/api/donations/{obj.reference}/receipt/"
        return format_html(
            '<a href="{}" target="_blank" style="background-color: #1b4332; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 11px;">📄 PDF Receipt</a>',
            url,
        )
    receipt_download_link.short_description = "Action"

    def changelist_view(self, request, extra_context=None):
        total_completed = Donation.objects.filter(status="completed").aggregate(Sum("amount"))["amount__sum"] or 0
        total_pending = Donation.objects.filter(status="pending").aggregate(Sum("amount"))["amount__sum"] or 0
        total_count = Donation.objects.count()

        completed_str = f"{int(total_completed):,} TZS"
        pending_str = f"{int(total_pending):,} TZS"
        count_str = f"{total_count}"

        extra_context = extra_context or {}
        extra_context["title"] = format_html(
            "Donations Management Overview "
            '<div style="margin-top: 10px; display: flex; gap: 15px; font-size: 13px; font-weight: normal;">'
            '<span style="background: #e8f5e9; color: #1b4332; padding: 8px 14px; border-radius: 6px; border-left: 4px solid #2e7d32;">💰 Total Completed: <b>{}</b></span>'
            '<span style="background: #fff8e1; color: #78350f; padding: 8px 14px; border-radius: 6px; border-left: 4px solid #f57f17;">⏳ Pending: <b>{}</b></span>'
            '<span style="background: #e3f2fd; color: #1e3a8a; padding: 8px 14px; border-radius: 6px; border-left: 4px solid #1976d2;">👥 Total Donors: <b>{}</b></span>'
            '</div>',
            completed_str,
            pending_str,
            count_str,
        )
        return super().changelist_view(request, extra_context=extra_context)
