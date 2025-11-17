from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from shops.models import Shop, Payment
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from django.db import transaction

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


@api_view(['GET'])
@permission_classes([AllowAny])
def tenant_shops(request, tenant_id):
    """Get all shops assigned to a specific tenant with payment details"""
    try:
        shops = Shop.objects.filter(tenant_id=tenant_id, is_occupied=True)
        
        shops_data = []
        for shop in shops:
            # Get recent payments for this shop
            recent_payments = Payment.objects.filter(
                shop=shop, 
                status='completed'
            ).order_by('-payment_date')[:5]
            
            shops_data.append({
                'id': shop.id,
                'shop_number': shop.shop_number,
                'shop_type': shop.shop_type,
                'floor_number': shop.floor_number,
                'monthly_rent': float(shop.monthly_rent),
                'total_paid': float(shop.total_paid),
                'balance': float(shop.balance),
                'next_due_date': shop.next_due_date.isoformat() if shop.next_due_date else None,
                'payment_status': shop.get_payment_status(),
                'recent_payments': [
                    {
                        'id': p.id,
                        'amount': float(p.amount),
                        'payment_date': p.payment_date.isoformat(),
                        'payment_method': p.payment_method,
                        'reference': p.reference
                    }
                    for p in recent_payments
                ]
            })
        
        return Response({'shops': shops_data}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def make_payment(request):
    """
    Process a rent payment for a shop
    Handles partial payments, overpayments, and updates balance/due dates
    """
    try:
        shop_id = request.data.get('shop_id')
        amount = float(request.data.get('amount', 0))
        payment_method = request.data.get('payment_method')
        reference = request.data.get('reference', '')
        tenant_id = request.data.get('tenant_id')
        
        # Validation
        if not shop_id or amount <= 0:
            return Response({
                'error': 'Invalid shop or amount'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if payment_method not in ['mobile_money', 'bank_transfer', 'cash']:
            return Response({
                'error': 'Invalid payment method'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get shop
        shop = Shop.objects.get(id=shop_id, tenant_id=tenant_id)
        
        # Use transaction to ensure data consistency
        with transaction.atomic():
            # Record balance before payment
            balance_before = shop.balance if shop.balance else shop.monthly_rent
            
            # Create payment record
            payment = Payment.objects.create(
                shop=shop,
                tenant_id=tenant_id,
                amount=amount,
                payment_method=payment_method,
                payment_month=datetime.now().strftime('%Y-%m'),
                status='completed',
                reference=reference,
                balance_before=balance_before
            )
            
            # Update shop balance and due date
            shop.update_balance_and_due_date(amount)
            
            # Update payment with new balance
            payment.balance_after = shop.balance
            payment.save()
        
        return Response({
            'message': 'Payment processed successfully',
            'payment': {
                'id': payment.id,
                'amount': float(payment.amount),
                'shop_number': shop.shop_number,
                'balance_after': float(shop.balance),
                'next_due_date': shop.next_due_date.isoformat() if shop.next_due_date else None,
                'reference': payment.reference
            }
        }, status=status.HTTP_201_CREATED)
    
    except Shop.DoesNotExist:
        return Response({
            'error': 'Shop not found or not assigned to this tenant'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'error': f'Payment failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def payment_history(request, tenant_id):
    """Get payment history for a specific tenant"""
    try:
        payments = Payment.objects.filter(
            tenant_id=tenant_id,
            status='completed'
        ).order_by('-payment_date')
        
        payments_data = [
            {
                'id': p.id,
                'shop_number': p.shop.shop_number,
                'amount': float(p.amount),
                'payment_method': p.payment_method,
                'payment_date': p.payment_date.isoformat(),
                'payment_month': p.payment_month,
                'reference': p.reference,
                'balance_before': float(p.balance_before),
                'balance_after': float(p.balance_after)
            }
            for p in payments
        ]
        
        return Response({
            'payments': payments_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)