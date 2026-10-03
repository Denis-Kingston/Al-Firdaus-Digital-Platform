import json
from django.db.models import Count, Sum
from donations.models import Cause, Donation
from events.models import RSVP
from institute.models import Course, CourseRegistration
from mosque_info.models import ContactMessage


def dashboard_callback(request, context=None):
    if context is None:
        context = {}

    total_donations = Donation.objects.filter(status="completed").aggregate(Sum("amount"))["amount__sum"] or 0
    pending_donations = Donation.objects.filter(status="pending").aggregate(Sum("amount"))["amount__sum"] or 0
    completed_count = Donation.objects.filter(status="completed").count()
    active_causes = Cause.objects.filter(is_active=True).count()
    active_courses = Course.objects.filter(is_active=True).count()
    total_registrations = CourseRegistration.objects.count()
    total_rsvps = RSVP.objects.count()
    unread_messages = ContactMessage.objects.filter(is_read=False).count()

    # Causes chart data
    causes_qs = Cause.objects.filter(is_active=True)[:5]
    cause_labels = [c.title for c in causes_qs] or ["General Fund"]
    cause_raised = [float(c.total_raised) for c in causes_qs] or [float(total_donations)]
    cause_targets = [float(c.target_amount) for c in causes_qs] or [10000000.0]

    # Category course enrolments chart data
    quran_count = CourseRegistration.objects.filter(course__category="quran").count()
    arabic_count = CourseRegistration.objects.filter(course__category="arabic").count()
    fiqh_count = CourseRegistration.objects.filter(course__category="islamic_studies").count()
    hifdh_count = CourseRegistration.objects.filter(course__category="hifdh").count()

    context["kpi_metrics"] = [
        {
            "title": "Total Donations Raised",
            "metric": f"{int(total_donations):,} TZS",
            "footer": f"{completed_count} successful transactions",
            "badge_color": "emerald",
            "icon": "payments",
        },
        {
            "title": "Pending Donations",
            "metric": f"{int(pending_donations):,} TZS",
            "footer": "Awaiting SIM PIN confirmation",
            "badge_color": "amber",
            "icon": "schedule",
        },
        {
            "title": "Active Causes & Courses",
            "metric": f"{active_causes} Causes / {active_courses} Courses",
            "footer": "Managed live in CMS",
            "badge_color": "emerald",
            "icon": "track_changes",
        },
        {
            "title": "Enrolments & RSVPs",
            "metric": f"{total_registrations} Students / {total_rsvps} RSVPs",
            "footer": "Community participation",
            "badge_color": "blue",
            "icon": "school",
        },
        {
            "title": "Unread Contact Messages",
            "metric": f"{unread_messages} Messages",
            "footer": "Action required by admin",
            "badge_color": "purple",
            "icon": "mark_email_unread",
        },
    ]

    context["chart_causes_json"] = json.dumps({
        "labels": cause_labels,
        "raised": cause_raised,
        "targets": cause_targets,
    })

    context["chart_courses_json"] = json.dumps({
        "labels": ["Quran & Tajweed", "Arabic Language", "Islamic Studies", "Hifdh Program"],
        "counts": [quran_count, arabic_count, fiqh_count, hifdh_count],
    })

    # Recent Event RSVPs with related event details
    context["recent_rsvps"] = list(
        RSVP.objects.select_related("event").order_by("-created_at")[:6]
    )

    # Recent Contact Form Messages
    context["recent_messages"] = list(
        ContactMessage.objects.order_by("-created_at")[:6]
    )

    # Recent Donations
    context["recent_donations"] = list(
        Donation.objects.select_related("cause").order_by("-created_at")[:6]
    )

    return context

