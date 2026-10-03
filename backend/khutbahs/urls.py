from django.urls import path
from .views import KhutbahListView

urlpatterns = [
    path("", KhutbahListView.as_view(), name="khutbah-list"),
]
