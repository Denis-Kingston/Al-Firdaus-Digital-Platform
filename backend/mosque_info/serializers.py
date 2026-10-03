from rest_framework import serializers
from .models import ContactMessage, Facility, SiteSetting, SiteStat, Teacher


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ["id", "name", "title", "bio", "photo_url", "specialty", "order"]


class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ["id", "title", "description", "icon", "capacity", "order"]


class SiteStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStat
        fields = ["id", "label", "value", "icon", "order"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "phone", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ["site_name", "phone", "email", "address", "about_text", "facebook_url", "youtube_url", "instagram_url"]
