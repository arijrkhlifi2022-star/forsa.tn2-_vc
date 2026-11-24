from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.first_name', read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id',
            'seller',
            'seller_name',
            'name',
            'category',
            'condition',
            'price',
            'city',
            'details',
            'description',
            'image',
            'created_at',
            'is_sold',
            'is_donation',
        ]
        read_only_fields = ['id', 'seller', 'created_at', 'is_sold']