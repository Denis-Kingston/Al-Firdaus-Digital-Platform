"""Reusable DRF permission classes mapped to Al Firdaus RBAC roles."""
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsContentEditor(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.can_manage_content)


class IsFinanceManager(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.can_manage_finance)


class IsAdmissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_authenticated and request.user.can_manage_admissions)


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_super_admin)


class IsStaffMember(BasePermission):
    """Any logged-in staff account — used for read-only dashboard/overview data
    that every role (including Viewer) should be able to see."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)