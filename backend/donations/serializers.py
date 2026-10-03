from rest_framework import serializers
from .models import Cause, Donation


class CauseSerializer(serializers.ModelSerializer):
    progress_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = Cause
        fields = ["id", "title", "description", "target_amount", "total_raised", "progress_percent", "is_active"]


class DonationSerializer(serializers.ModelSerializer):
    cause_title = serializers.ReadOnlyField(source="cause.title")

    class Meta:
        model = Donation
        fields = [
            "id",
            "cause",
            "cause_title",
            "donor_name",
            "donor_phone",
            "donor_email",
            "amount",
            "reference",
            "status",
            "selcom_order_id",
            "payment_method",
            "receipt_sent",
            "created_at",
        ]
        read_only_fields = ["reference", "status", "selcom_order_id", "receipt_sent", "created_at"]

