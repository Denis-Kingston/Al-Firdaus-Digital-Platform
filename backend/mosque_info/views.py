from rest_framework import generics, permissions
from .models import ContactMessage, Facility, SiteSetting, SiteStat, Teacher
from .serializers import (
    ContactMessageSerializer,
    FacilitySerializer,
    SiteSettingSerializer,
    SiteStatSerializer,
    TeacherSerializer,
)


class TeacherListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Teacher.objects.filter(is_active=True)
    serializer_class = TeacherSerializer


class FacilityListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Facility.objects.filter(is_active=True)
    serializer_class = FacilitySerializer


class SiteStatListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = SiteStat.objects.filter(is_active=True)
    serializer_class = SiteStatSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer


class SiteSettingDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SiteSettingSerializer

    def get_object(self):
        setting, _ = SiteSetting.objects.get_or_create(id=1)
        return setting
