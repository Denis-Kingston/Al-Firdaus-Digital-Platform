from django.contrib.auth import get_user_model
from django.contrib.auth.views import LoginView
from rest_framework import generics, permissions, status, response
from rest_framework.views import APIView
from .forms import AlFirdausLoginForm
from .serializers import PasswordResetSerializer, UserSerializer

User = get_user_model()


class AlFirdausLoginView(LoginView):
    template_name = "dashboard/login.html"
    authentication_form = AlFirdausLoginForm
    redirect_authenticated_user = True

    def form_valid(self, form):
        response_obj = super().form_valid(form)
        if form.cleaned_data.get("remember_me"):
            # Session persists for SESSION_COOKIE_AGE (default 2 weeks)
            self.request.session.set_expiry(1209600)
        else:
            # Session ends when the browser closes
            self.request.session.set_expiry(0)
        return response_obj


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class PasswordResetAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            # In production, send password reset link via SMTP
            return response.Response(
                {"message": f"Password reset instructions have been sent to {email}."},
                status=status.HTTP_200_OK,
            )
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)