from rest_framework import viewsets, permissions, filters, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Listing, Favorite
from .serializers import ListingSerializer
from .permissions import IsOwnerOrReadOnly

class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'city', 'condition', 'is_donation']
    search_fields = ['name', 'description', 'city', 'details']

    def get_queryset(self):
        if self.action == 'list':
            return Listing.objects.filter(is_sold=False)
        return Listing.objects.all()

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class MyListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(seller=self.request.user).order_by('-created_at')


class MyFavoritesView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(favorites__user=self.request.user).order_by('-favorites__created_at')


class FavoriteToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
        if not created:
            favorite.delete()
            return Response({"status": "removed", "is_favorite": False}, status=status.HTTP_200_OK)
        return Response({"status": "added", "is_favorite": True}, status=status.HTTP_201_CREATED)