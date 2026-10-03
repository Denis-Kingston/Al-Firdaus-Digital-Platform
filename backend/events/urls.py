from django.urls import path
from .views import EventListCreateView, EventRSVPView

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("<int:pk>/rsvp/", EventRSVPView.as_view(), name="event-rsvp"),
    path("<int:pk>/rsvps/", EventRSVPView.as_view(), name="event-rsvps"),
]

