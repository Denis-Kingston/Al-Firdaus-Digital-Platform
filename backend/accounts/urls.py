from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PasswordResetAPIView, UserProfileView

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("password-reset/", PasswordResetAPIView.as_view(), name="password_reset"),
    path("me/", UserProfileView.as_view(), name="user_profile"),
]
