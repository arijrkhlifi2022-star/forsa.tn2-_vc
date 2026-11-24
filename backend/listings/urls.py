from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet, FavoriteToggleView, MyListingsView, MyFavoritesView

router = DefaultRouter()
router.register(r'', ListingViewSet, basename='listing')

urlpatterns = [
    path('my-listings/', MyListingsView.as_view(), name='my_listings'),
    path('favorites/', MyFavoritesView.as_view(), name='my_favorites'),
    path('<int:listing_id>/favorite/', FavoriteToggleView.as_view(), name='listing_favorite'),
    path('', include(router.urls)),
]