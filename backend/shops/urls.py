from django.urls import path
from . import views


urlpatterns = [
    path('available-shops/', views.available_shops, name='available_shops'), 
]   