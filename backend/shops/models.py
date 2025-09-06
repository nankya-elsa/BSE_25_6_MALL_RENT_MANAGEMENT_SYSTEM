from django.db import models
from django.conf import settings

class Shop(models.Model):
    """Model representing a shop in the mall"""
    
    shop_number = models.CharField(max_length=10, unique=True)
    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='shops'  # Changed from 'shop' to 'shops'
    )
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    shop_type = models.CharField(max_length=100, default='General')
    floor_number = models.IntegerField(default=1)
    is_occupied = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Shop {self.shop_number}"
    
    class Meta:
        ordering = ['shop_number']

class Payment(models.Model):
    """Model for rent payments"""
    
    PAYMENT_METHOD_CHOICES = [
        ('mobile_money', 'Mobile Money'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='payments')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_month = models.CharField(max_length=7)  # Format: "2024-01"
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='completed')
    reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment {self.amount} for Shop {self.shop.shop_number} - {self.payment_month}"
    
    class Meta:
        ordering = ['-payment_date']