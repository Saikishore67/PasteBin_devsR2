from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Only the owner can update/delete. Read access is handled separately
    in the view's get_queryset based on visibility.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user