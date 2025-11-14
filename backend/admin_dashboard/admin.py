from django.contrib import admin
from .models import ProfileChangeRequest

@admin.register(ProfileChangeRequest)
class ProfileChangeRequestAdmin(admin.ModelAdmin):
    list_display = ['tenant', 'status', 'created_at', 'reviewed_at']
    list_filter = ['status', 'created_at']
    search_fields = ['tenant__email', 'tenant__first_name', 'tenant__last_name']