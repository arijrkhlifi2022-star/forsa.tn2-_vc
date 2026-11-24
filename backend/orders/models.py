from django.db import models
from django.conf import settings
from listings.models import Listing

class Order(models.Model):
    PAYMENT_METHODS = [
        ('delivery', 'Paiement à la livraison'),
        ('card', 'Carte bancaire'),
    ]

    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    listing = models.ForeignKey(Listing, on_delete=models.PROTECT, related_name='orders')
    buyer_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=80)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='delivery')
    total_price = models.DecimalField(max_digits=10, decimal_places=3)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Commande #{self.id} - {self.listing.name}"