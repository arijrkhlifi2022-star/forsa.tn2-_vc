from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    الكل ينجم يشوف الإعلانات (GET)،
    لكن التعديل والحذف (PUT/PATCH/DELETE) مسموح لصاحب الإعلان فقط.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.seller == request.user