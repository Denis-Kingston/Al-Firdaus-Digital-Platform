from django.urls import path
from .views import (
    CauseListView,
    DonationListView,
    DownloadReceiptView,
    InitiateDonationView,
    SelcomWebhookView,
    SimulatePushPaymentView,
)

urlpatterns = [
    path("", DonationListView.as_view(), name="donation-list-create"),
    path("causes/", CauseListView.as_view(), name="cause-list"),
    path("donate/", InitiateDonationView.as_view(), name="initiate-donation"),
    path("simulate-push/", SimulatePushPaymentView.as_view(), name="simulate-push-payment"),
    path("webhook/selcom/", SelcomWebhookView.as_view(), name="selcom-webhook"),
    path("<str:reference>/receipt/", DownloadReceiptView.as_view(), name="download-receipt"),
]
