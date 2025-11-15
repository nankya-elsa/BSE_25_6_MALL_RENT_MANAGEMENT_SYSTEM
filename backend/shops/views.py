from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from shops.models import Shop, Payment
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def available_shops(request):
    """Get list of unoccupied shops available for assignment"""
    shops = Shop.objects.filter(is_occupied=False).order_by('shop_number')
    
    shops_data = [
        {
            'shop_number': shop.shop_number,
            'monthly_rent': float(shop.monthly_rent),
            'shop_type': shop.shop_type,
            'floor_number': shop.floor_number
        }
        for shop in shops
    ]
    
    return Response({'shops': shops_data})
