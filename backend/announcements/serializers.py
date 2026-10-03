from rest_framework import serializers
from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source="author.get_full_name")

    class Meta:
        model = Announcement
        fields = [
            "id",
            "title",
            "content",
            "category",
            "is_urgent",
            "is_active",
            "author",
            "author_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["author", "created_at", "updated_at"]
