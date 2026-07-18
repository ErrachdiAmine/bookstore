from rest_framework import permissions


class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    """Allow read-only to anyone. For unsafe methods:
    - POST: allow for authenticated users (they become the seller)
    - PUT/PATCH/DELETE: allow only if request.user is the object's seller or is staff
    """

    def has_permission(self, request, view):
        # Allow any safe methods
        if request.method in permissions.SAFE_METHODS:
            return True
        # For other methods, require authentication
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Staff can do anything
        if request.user and request.user.is_staff:
            return True
        # Allow write only if the user is the seller/owner
        seller = getattr(obj, 'seller', None)
        return seller is not None and seller == request.user
