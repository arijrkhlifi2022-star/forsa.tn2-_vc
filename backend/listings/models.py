from django.db import models
from django.conf import settings

class Listing(models.Model):
    CATEGORIES = [
        ('telephones', 'Téléphones et accessoires'),
        ('informatique', 'Informatique'),
        ('vetements', 'Vêtements'),
        ('maison', 'Maison et décoration'),
        ('electromenager', 'Électroménager'),
        ('autres', 'Autres'),
    ]
    CONDITIONS = [
        ('Neuf', 'Neuf'),
        ('Comme neuf', 'Comme neuf'),
        ('Très bon état', 'Très bon état'),
        ('Bon état', 'Bon état'),
        ('État correct', 'État correct'),
    ]

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=30, choices=CATEGORIES)
    condition = models.CharField(max_length=30, choices=CONDITIONS)
    price = models.DecimalField(max_digits=10, decimal_places=3) # بالدينار التونسي
    city = models.CharField(max_length=80)
    details = models.CharField(max_length=200, blank=True)
    description = models.TextField(max_length=2000)
    image = models.ImageField(upload_to='listings/%Y/%m/')
    created_at = models.DateTimeField(auto_now_add=True)
    is_sold = models.BooleanField(default=False)
    is_donation = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.price} DT"


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')

    def __str__(self):
        return f"{self.user.email} -> {self.listing.name}"