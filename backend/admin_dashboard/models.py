from django.db import models
from django.conf import settings

class ProfileChangeRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile_requests')
    requested_changes = models.JSONField()  # Store what fields they want to change
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='reviewed_requests')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Request by {self.tenant.email} - {self.status}"