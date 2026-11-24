from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    listing_name = serializers.ReadOnlyField(source='listing.name')

    class Meta:
        model = Order
        fields = [
            'id', 'listing', 'listing_name', 'buyer_name',
            'phone', 'address', 'city', 'payment_method',
            'total_price', 'created_at'
        ]
        read_only_fields = ['id', 'total_price', 'created_at']

    def validate_payment_method(self, value):
        if value != 'delivery':
            raise serializers.ValidationError(
                "Le paiement par carte n'est pas encore disponible. Choisissez le paiement à la livraison."
            )
        return value

    def validate_listing(self, listing):
        if listing.is_sold:
            raise serializers.ValidationError("Cet article a déjà été vendu.")
        return listing