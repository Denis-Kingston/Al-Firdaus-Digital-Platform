from rest_framework import generics, permissions, status
from rest_framework.response import Response
from accounts.permissions import IsAdmissions, IsContentEditor
from .models import Course, CourseRegistration
from .serializers import CourseRegistrationSerializer, CourseSerializer


class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [IsContentEditor()]


class CourseRegistrationView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            errors = serializer.errors
            err_dict = None
            if isinstance(errors, dict):
                if errors.get("already_registered"):
                    err_dict = errors
                elif isinstance(errors.get("non_field_errors"), list) and errors["non_field_errors"]:
                    first_err = errors["non_field_errors"][0]
                    if isinstance(first_err, dict) and first_err.get("already_registered"):
                        err_dict = first_err

            if err_dict:
                def to_str(v, default=""):
                    if isinstance(v, (list, tuple)) and v:
                        return str(v[0])
                    return str(v or default)

                return Response(
                    {
                        "already_registered": True,
                        "detail": to_str(err_dict.get("detail"), "Tayari umeshajisajili kwenye kozi hii!"),
                        "message": to_str(err_dict.get("message"), "Taarifa zako tayari zipo kwenye mfumo kwa kozi hii."),
                    },
                    status=status.HTTP_409_CONFLICT,
                )
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "success": True,
                "message": "Usajili wako umepokelewa kikamilifu! Ofisi ya chuo itawasiliana nawe hivi punde.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class CourseRegistrationListView(generics.ListAPIView):
    permission_classes = [IsAdmissions]
    queryset = CourseRegistration.objects.all()
    serializer_class = CourseRegistrationSerializer
