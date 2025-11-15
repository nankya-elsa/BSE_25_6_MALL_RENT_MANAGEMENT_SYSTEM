from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from user_accounts.models import User
from shops.models import Shop, Payment
from .models import ProfileChangeRequest
from django.db.models import Sum, Count
from datetime import datetime, timedelta

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    """Get dashboard statistics"""
    total_tenants = User.objects.filter(user_type='tenant', is_staff=False).count()
    total_shops = Shop.objects.count()
    occupied_shops = Shop.objects.filter(is_occupied=True).count()
    
    # Payment statistics
    current_month = datetime.now().month
    current_year = datetime.now().year
    monthly_revenue = Payment.objects.filter(
        payment_date__month=current_month,
        payment_date__year=current_year,
        status='completed'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    pending_requests = ProfileChangeRequest.objects.filter(status='pending').count()
    
    return Response({
        'total_tenants': total_tenants,
        'total_shops': total_shops,
        'occupied_shops': occupied_shops,
        'vacant_shops': total_shops - occupied_shops,
        'monthly_revenue': float(monthly_revenue),
        'pending_requests': pending_requests
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def tenant_list(request):
    """Get all tenants (exclude admins/staff)"""
    # Only get users who are tenants (not staff/admin)
    tenants = User.objects.filter(user_type='tenant', is_staff=False)
    tenant_data = []
    
    for tenant in tenants:
        shops = Shop.objects.filter(tenant=tenant)
        tenant_data.append({
            'id': tenant.id,
            'full_name': tenant.full_name,
            'email': tenant.email,
            'phone_number': tenant.phone_number,
            'shop_count': shops.count(),
            'shops': [{'shop_number': s.shop_number, 'monthly_rent': float(s.monthly_rent)} for s in shops],
            'created_at': tenant.created_at
        })
    
    return Response({'tenants': tenant_data})

@api_view(['POST'])
@permission_classes([AllowAny])
def register_tenant(request):
    """
    Admin registers a new tenant with shop assignments
    Admin provides basic info, tenant will set password on first login
    """
    from user_accounts.serializers import AdminTenantRegistrationSerializer
    
    serializer = AdminTenantRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        # Create tenant and assign shops
        result = serializer.save()
        user = result['user']
        assigned_shops = result['assigned_shops']
        temp_password = result['temp_password']
        
        # Prepare shop information for response
        shops_info = [
            {
                'shop_number': shop.shop_number,
                'monthly_rent': float(shop.monthly_rent),
                'shop_type': shop.shop_type,
                'floor_number': shop.floor_number
            }
            for shop in assigned_shops
        ]
        
        return Response({
            'message': 'Tenant registered successfully',
            'tenant': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'username': user.username,
                'phone_number': user.phone_number
            },
            'assigned_shops': shops_info,
            'temp_password': temp_password,  # Admin should communicate this to tenant
            'note': 'Tenant should change password on first login'
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Registration failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_tenant(request, tenant_id):
    """
    Delete a tenant and mark their shops as vacant
    """
    try:
        tenant = User.objects.get(id=tenant_id, user_type='tenant')
        
        # Get all shops assigned to this tenant
        tenant_shops = Shop.objects.filter(tenant=tenant)
        
        # Mark shops as vacant before deleting tenant
        for shop in tenant_shops:
            shop.tenant = None
            shop.is_occupied = False
            shop.save()
        
        # Delete the tenant
        tenant.delete()
        
        return Response({
            'message': 'Tenant deleted successfully',
            'shops_vacated': [shop.shop_number for shop in tenant_shops]
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'message': 'Tenant not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'message': f'Error deleting tenant: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def profile_change_requests(request):
    """Get all profile change requests"""
    requests_list = ProfileChangeRequest.objects.all()
    data = []
    
    for req in requests_list:
        data.append({
            'id': req.id,
            'tenant_name': req.tenant.full_name,
            'tenant_email': req.tenant.email,
            'requested_changes': req.requested_changes,
            'reason': req.reason,
            'status': req.status,
            'created_at': req.created_at
        })
    
    return Response({'requests': data})

@api_view(['POST'])
@permission_classes([AllowAny])
def approve_profile_request(request, request_id):
    """Approve a profile change request"""
    try:
        change_request = ProfileChangeRequest.objects.get(id=request_id)
        change_request.status = 'approved'
        change_request.reviewed_at = datetime.now()
        change_request.save()
        
        # Apply the changes to user
        tenant = change_request.tenant
        changes = change_request.requested_changes
        
        for field, value in changes.items():
            setattr(tenant, field, value)
        tenant.save()
        
        return Response({'message': 'Request approved and changes applied'})
    except ProfileChangeRequest.DoesNotExist:
        return Response({'message': 'Request not found'}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def reject_profile_request(request, request_id):
    """Reject a profile change request"""
    try:
        change_request = ProfileChangeRequest.objects.get(id=request_id)
        change_request.status = 'rejected'
        change_request.reviewed_at = datetime.now()
        change_request.save()
        
        return Response({'message': 'Request rejected'})
    except ProfileChangeRequest.DoesNotExist:
        return Response({'message': 'Request not found'}, status=404)

@api_view(['GET'])
@permission_classes([AllowAny])
def payment_history(request):
    """Get payment history for analytics"""
    payments = Payment.objects.all().order_by('-payment_date')[:50]
    
    data = []
    for payment in payments:
        data.append({
            'id': payment.id,
            'tenant_name': payment.tenant.full_name,
            'shop_number': payment.shop.shop_number,
            'amount': float(payment.amount),
            'payment_date': payment.payment_date,
            'payment_method': payment.payment_method,
            'status': payment.status
        })
    
    return Response({'payments': data})