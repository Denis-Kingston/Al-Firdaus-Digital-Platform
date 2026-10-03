from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, response, status
from rest_framework.views import APIView
from accounts.permissions import IsContentEditor
from .models import Event, RSVP
from .serializers import EventSerializer, RSVPSerializer


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [IsContentEditor()]


class EventRSVPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        serializer = RSVPSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(event=event)
            event.rsvp_count += 1
            event.save()
            return response.Response(
                {"message": "RSVP recorded", "rsvp_count": event.rsvp_count},
                status=status.HTTP_201_CREATED
            )
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

