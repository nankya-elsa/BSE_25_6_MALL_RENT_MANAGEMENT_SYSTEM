from django.db import models
from django.conf import settings
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

class Shop(models.Model):
    """Model representing a shop in the mall"""
    
    shop_number = models.CharField(max_length=10, unique=True)
    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='shops'
    )
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    shop_type = models.CharField(max_length=100, default='General')
    floor_number = models.IntegerField(default=1)
    is_occupied = models.BooleanField(default=False)
    
    # Payment tracking fields
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    next_due_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Shop {self.shop_number}"
    
    def update_balance_and_due_date(self, payment_amount):
        """
        Update balance and due date after a payment
        Handles overpayments by advancing the due date
        """
        from decimal import Decimal
        payment_amount = Decimal(str(payment_amount))
        
        # Add payment to total paid
        self.total_paid += payment_amount
        
        # Calculate new balance (negative balance means advance payment)
        if not self.next_due_date:
            # First payment - set initial due date to next month
            self.next_due_date = datetime.now().date() + relativedelta(months=1)
            self.balance = self.monthly_rent - payment_amount
        else:
            # Reduce balance
            self.balance -= payment_amount
            
            # If overpaid (balance is negative), advance due date
            while self.balance <= 0 and abs(self.balance) >= self.monthly_rent:
                months_paid = int(abs(self.balance) // self.monthly_rent)
                self.next_due_date += relativedelta(months=months_paid)
                self.balance += (months_paid * self.monthly_rent)
            
            # If there's still negative balance but less than monthly rent, just advance one month
            if self.balance < 0:
                self.next_due_date += relativedelta(months=1)
                self.balance = self.monthly_rent + self.balance  # balance is negative
        
        self.save()
    
    def get_payment_status(self):
        """Get current payment status"""
        if not self.next_due_date:
            return 'No payments yet'
        
        today = datetime.now().date()
        if self.balance <= 0:
            return 'Paid in advance'
        elif today > self.next_due_date:
            days_overdue = (today - self.next_due_date).days
            return f'Overdue by {days_overdue} days'
        elif today == self.next_due_date:
            return 'Due today'
        else:
            days_until_due = (self.next_due_date - today).days
            return f'Due in {days_until_due} days'
    
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
    payment_month = models.CharField(max_length=7)  # Format: "2024-11"
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='completed')
    reference = models.CharField(max_length=100, blank=True)
    
    # Additional tracking
    balance_before = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_after = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment {self.amount} for Shop {self.shop.shop_number} - {self.payment_month}"
    
    class Meta:
        ordering = ['-payment_date']