from django.urls import path
from . import views


urlpatterns = [
    path('available-shops/', views.available_shops, name='available_shops'),
    path('tenant/<int:tenant_id>/shops/', views.tenant_shops, name='tenant_shops'),
    path('payment/make/', views.make_payment, name='make_payment'),
    path('tenant/<int:tenant_id>/payment-history/', views.payment_history, name='payment_history'),
]   