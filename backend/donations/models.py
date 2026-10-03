from django.db import models


class Cause(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_raised = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def progress_percent(self):
        if not self.target_amount or self.target_amount == 0:
            return 0
        return float((self.total_raised / self.target_amount) * 100)

    def __str__(self):
        return self.title


class Donation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    cause = models.ForeignKey(Cause, related_name="donations", on_delete=models.SET_NULL, null=True, blank=True)
    donor_name = models.CharField(max_length=128, blank=True)
    donor_phone = models.CharField(max_length=32, blank=True)
    donor_email = models.EmailField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reference = models.CharField(max_length=64, unique=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    selcom_order_id = models.CharField(max_length=64, blank=True)
    payment_method = models.CharField(max_length=32, default="SELCOM_PAY")
    receipt_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Donation {self.reference} - {self.amount} TZS ({self.get_status_display()})"

