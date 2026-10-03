from rest_framework import serializers
from .models import Event, RSVP


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "title", "description", "location", "event_date", "rsvp_count", "is_active"]


class RSVPSerializer(serializers.ModelSerializer):
    class Meta:
        model = RSVP
        fields = ["id", "name", "phone", "created_at"]
