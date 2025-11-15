from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard_stats'),
    path('tenants/', views.tenant_list, name='tenant_list'),
    path('register-tenant/', views.register_tenant, name='register_tenant'),
    path('profile-requests/', views.profile_change_requests, name='profile_requests'),
    path('profile-requests/<int:request_id>/approve/', views.approve_profile_request, name='approve_request'),
    path('profile-requests/<int:request_id>/reject/', views.reject_profile_request, name='reject_request'),
    path('payment-history/', views.payment_history, name='payment_history'),
    path('tenants/<int:tenant_id>/delete/', views.delete_tenant, name='delete_tenant'),
]