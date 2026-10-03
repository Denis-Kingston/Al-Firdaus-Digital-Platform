from django.urls import path
from .views import CourseListCreateView, CourseRegistrationListView, CourseRegistrationView

urlpatterns = [
    path("courses/", CourseListCreateView.as_view(), name="course-list-create"),
    path("register/", CourseRegistrationView.as_view(), name="course-register"),
    path("registrations/", CourseRegistrationListView.as_view(), name="course-registration-list"),
]
