from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        listing = serializer.validated_data['listing']
        buyer = self.request.user if self.request.user.is_authenticated else None

        serializer.save(
            buyer=buyer,
            total_price=listing.price
        )

        listing.is_sold = True
        listing.save(update_fields=['is_sold'])


class MyOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user).order_by('-created_at')