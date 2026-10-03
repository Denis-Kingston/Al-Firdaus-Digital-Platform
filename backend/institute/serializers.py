import re
from rest_framework import serializers
from .models import Course, CourseRegistration


def normalize_phone(raw_phone: str) -> str:
    """Normalize phone number to standard digits or Tanzanian format."""
    if not raw_phone:
        return ""
    digits = re.sub(r"\D", "", raw_phone)
    if digits.startswith("255") and len(digits) == 12:
        return "0" + digits[3:]
    if len(digits) == 9 and not digits.startswith("0"):
        return "0" + digits
    return digits


class CourseSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "category",
            "category_display",
            "description",
            "age_group",
            "schedule",
            "instructor",
            "is_active",
            "is_featured",
            "created_at",
        ]


class CourseRegistrationSerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source="course.title")

    class Meta:
        model = CourseRegistration
        fields = ["id", "course", "course_title", "full_name", "phone", "email", "notes", "status", "created_at"]
        read_only_fields = ["status", "created_at"]

    def validate(self, attrs):
        course = attrs.get("course")
        raw_phone = (attrs.get("phone") or "").strip()
        raw_email = (attrs.get("email") or "").strip().lower()
        cleaned_phone = normalize_phone(raw_phone)
        digits_core = re.sub(r"\D", "", raw_phone)[-9:] if len(re.sub(r"\D", "", raw_phone)) >= 9 else raw_phone

        # Query all existing registrations for this specific course
        existing_regs = CourseRegistration.objects.filter(course=course)

        phone_matched = False
        for reg in existing_regs:
            reg_digits = re.sub(r"\D", "", reg.phone)
            if reg.phone == raw_phone or reg.phone == cleaned_phone:
                phone_matched = True
                break
            if len(reg_digits) >= 9 and digits_core and reg_digits[-9:] == digits_core:
                phone_matched = True
                break

        email_matched = False
        if raw_email:
            email_matched = existing_regs.filter(email__iexact=raw_email).exists()

        if phone_matched or email_matched:
            course_title = course.title if course else "kozi hii"
            raise serializers.ValidationError({
                "already_registered": True,
                "detail": f"Tayari umeshajisajili kwenye kozi ya {course_title}!",
                "message": f"Namba ya simu ({raw_phone}) au barua pepe uliyoingiza tayari imeshajisajili kwenye kozi ya {course_title}. Ofisi ya masomo ya Al Firdaus itawasiliana nawe."
            })

        attrs["phone"] = cleaned_phone or raw_phone
        if raw_email:
            attrs["email"] = raw_email
        return attrs

