from rest_framework import serializers
from .models import Khutbah


class KhutbahSerializer(serializers.ModelSerializer):
    class Meta:
        model = Khutbah
        fields = ["id", "title", "speaker", "date", "audio", "summary"]
