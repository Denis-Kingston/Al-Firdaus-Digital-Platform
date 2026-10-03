from rest_framework import generics
from .models import Khutbah
from .serializers import KhutbahSerializer


class KhutbahListView(generics.ListAPIView):
    queryset = Khutbah.objects.all()
    serializer_class = KhutbahSerializer
