import uuid
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, response, status
from rest_framework.views import APIView
from accounts.permissions import IsFinanceManager
from .models import Cause, Donation
from .receipt import generate_donation_receipt_pdf
from .serializers import CauseSerializer, DonationSerializer
from .services import SelcomPaymentService


class CauseListView(generics.ListAPIView):
    queryset = Cause.objects.filter(is_active=True)
    serializer_class = CauseSerializer


class DonationListView(generics.ListCreateAPIView):
    queryset = Donation.objects.all().order_by("-created_at")
    serializer_class = DonationSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.AllowAny()]
        return [IsFinanceManager()]


class InitiateDonationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = DonationSerializer(data=request.data)
        if serializer.is_valid():
            reference = f"AF-{uuid.uuid4().hex[:8].upper()}"
            donation = serializer.save(
                reference=reference,
                status="pending"
            )

            # Initiate Selcom Order
            selcom_service = SelcomPaymentService()
            selcom_res = selcom_service.create_checkout_order(donation)

            if selcom_res.get("result") == "SUCCESS":
                donation.selcom_order_id = selcom_res.get("order_id", "")
                donation.save()

                return response.Response(
                    {
                        "message": "Donation initiated successfully",
                        "reference": donation.reference,
                        "order_id": donation.selcom_order_id,
                        "payment_url": selcom_res.get("payment_url"),
                        "status": donation.status,
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                donation.status = "failed"
                donation.save()
                return response.Response(
                    {
                        "message": "Failed to initiate payment gateway",
                        "error": selcom_res.get("message"),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SelcomWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        order_id = data.get("order_id") or data.get("trans_id")
        reference = data.get("reference") or (order_id.replace("ORD-", "") if order_id else None)
        payment_status = str(data.get("payment_status", "")).upper()

        if not reference:
            return response.Response({"error": "Missing reference"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            donation = Donation.objects.get(reference=reference)
        except Donation.DoesNotExist:
            return response.Response({"error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)

        # Idempotency check: if already completed, acknowledge success without duplicating
        if donation.status == "completed":
            return response.Response({"message": "Webhook already processed"}, status=status.HTTP_200_OK)

        if payment_status in ("COMPLETED", "SUCCESS", "PAID"):
            donation.status = "completed"
            donation.payment_method = data.get("channel", "SELCOM_PAY")
            donation.save()

            if donation.cause:
                donation.cause.total_raised += donation.amount
                donation.cause.save()

            # Send Email Receipt if donor_email is present
            if donation.donor_email and not donation.receipt_sent:
                try:
                    pdf_bytes = generate_donation_receipt_pdf(donation)
                    email = EmailMessage(
                        subject=f"Al-Firdaus Donation Receipt - {donation.reference}",
                        body=f"Assalamu Alaikum {donation.donor_name or 'Valued Donor'},\n\nThank you for your generous contribution of {donation.amount:,.2f} TZS to Al-Firdaus Institute & Mosque.\n\nPlease find your official donation receipt attached.\n\nJazakallahu Khayran,\nAl-Firdaus Team",
                        from_email="donations@al-firdaus.org",
                        to=[donation.donor_email],
                    )
                    email.attach(f"Receipt-{donation.reference}.pdf", pdf_bytes, "application/pdf")
                    email.send(fail_silently=True)
                    donation.receipt_sent = True
                    donation.save()
                except Exception as e:
                    pass

            return response.Response({"message": "Donation status updated to completed"}, status=status.HTTP_200_OK)
        else:
            donation.status = "failed"
            donation.save()
            return response.Response({"message": "Donation marked as failed"}, status=status.HTTP_200_OK)


class DownloadReceiptView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, reference):
        donation = get_object_or_404(Donation, reference=reference)
        pdf_bytes = generate_donation_receipt_pdf(donation)
        resp = HttpResponse(pdf_bytes, content_type="application/pdf")
        resp["Content-Disposition"] = f'attachment; filename="Receipt-{donation.reference}.pdf"'
        return resp


class SimulatePushPaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        reference = request.data.get("reference")
        phone = request.data.get("phone", "")
        action = request.data.get("action", "approve")

        if not reference:
            return response.Response({"error": "Reference is required"}, status=status.HTTP_400_BAD_REQUEST)

        donation = get_object_or_404(Donation, reference=reference)

        if donation.status == "completed":
            return response.Response(
                {
                    "message": "Payment already completed",
                    "reference": donation.reference,
                    "status": "completed",
                    "receipt_url": f"/api/donations/{donation.reference}/receipt/",
                },
                status=status.HTTP_200_OK,
            )

        if action == "decline":
            donation.status = "failed"
            donation.save()
            return response.Response(
                {
                    "message": "Transaction declined by user",
                    "reference": donation.reference,
                    "status": "failed",
                },
                status=status.HTTP_200_OK,
            )

        # Detect operator network from phone prefix
        network = "SELCOM_PUSH"
        clean_phone = phone.replace("+", "").replace(" ", "")
        if clean_phone.startswith("25575") or clean_phone.startswith("075") or clean_phone.startswith("25576") or clean_phone.startswith("076"):
            network = "M-PESA (Vodacom)"
        elif clean_phone.startswith("25571") or clean_phone.startswith("071") or clean_phone.startswith("25565") or clean_phone.startswith("065"):
            network = "TIGO PESA"
        elif clean_phone.startswith("25578") or clean_phone.startswith("078") or clean_phone.startswith("25568") or clean_phone.startswith("068"):
            network = "AIRTEL MONEY"
        elif clean_phone.startswith("25562") or clean_phone.startswith("062"):
            network = "HALOPESA"

        donation.status = "completed"
        donation.payment_method = network
        donation.save()

        if donation.cause:
            donation.cause.total_raised += donation.amount
            donation.cause.save()

        # Send email receipt if available
        if donation.donor_email and not donation.receipt_sent:
            try:
                pdf_bytes = generate_donation_receipt_pdf(donation)
                email = EmailMessage(
                    subject=f"Al-Firdaus Donation Receipt - {donation.reference}",
                    body=f"Assalamu Alaikum {donation.donor_name or 'Valued Donor'},\n\nThank you for your generous contribution of {donation.amount:,.2f} TZS to Al-Firdaus Institute & Mosque via {network}.\n\nPlease find your official donation receipt attached.\n\nJazakallahu Khayran,\nAl-Firdaus Team",
                    from_email="donations@al-firdaus.org",
                    to=[donation.donor_email],
                )
                email.attach(f"Receipt-{donation.reference}.pdf", pdf_bytes, "application/pdf")
                email.send(fail_silently=True)
                donation.receipt_sent = True
                donation.save()
            except Exception:
                pass

        return response.Response(
            {
                "message": "Payment completed successfully via USSD Push Simulation",
                "reference": donation.reference,
                "amount": float(donation.amount),
                "network": network,
                "status": "completed",
                "receipt_url": f"/api/donations/{donation.reference}/receipt/",
            },
            status=status.HTTP_200_OK,
        )

