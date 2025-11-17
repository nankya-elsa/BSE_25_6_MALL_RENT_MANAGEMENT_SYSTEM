from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from .models import User
from django.contrib.auth import get_user_model
import logging

# Create logger for this module
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    email = request.data.get('email', 'unknown')
    logger.info(f"Registration attempt for email: {email}")
    
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            user_data = UserSerializer(user).data
            logger.info(f"User registered successfully: {email}")
            
            return Response({
                'message': 'User registered successfully',
                'user': user_data,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Registration error for {email}: {str(e)}")
            return Response({
                'message': 'Registration failed',
                'errors': {'error': 'Internal server error'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    logger.warning(f"Registration validation failed for {email}: {serializer.errors}")
    return Response({
        'message': 'Registration failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user and return user data including role"""
    email = request.data.get('email', 'unknown')
    password = request.data.get('password')
    change_password = request.data.get('change_password', False)  # NEW
    
    logger.info(f"Login attempt for email: {email}")
    
    # Validate input
    if not email or not password:
        return Response({
            'message': 'Email and password are required',
            'errors': {
                'email': 'This field is required' if not email else None,
                'password': 'This field is required' if not password else None,
            }
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        
        if not user.is_active:
            logger.warning(f"Login attempt for inactive user: {email}")
            return Response({
                'message': 'Your account is not active. Please contact the administrator.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if user.check_password(password):
            
            # If user changed their password, update the flag
            if change_password and user.has_temporary_password:
                user.has_temporary_password = False
                user.save()
                logger.info(f"User {email} changed temporary password")
            
            user_data = {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'full_name': user.get_full_name() if hasattr(user, 'get_full_name') else f"{user.first_name} {user.last_name}",
                'phone_number': getattr(user, 'phone_number', ''),
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'user_type': 'admin' if user.is_staff else 'tenant',
            }
            
            logger.info(f"Successful login for user: {email} (is_staff: {user.is_staff})")
            
            return Response({
                'message': 'Login successful',
                'user': user_data,
            }, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Failed login attempt - invalid password for: {email}")
            return Response({
                'message': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except User.DoesNotExist:
        logger.warning(f"Failed login attempt - user not found: {email}")
        return Response({
            'message': 'Invalid email or password'
        }, status=status.HTTP_401_UNAUTHORIZED)
        
    except Exception as e:
        logger.error(f"Login error for {email}: {str(e)}", exc_info=True)
        return Response({
            'message': 'An error occurred during login. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def logout(request):
    """Logout user"""
    user_email = getattr(request.user, 'email', 'unknown')
    logger.info(f"Logout attempt for user: {user_email}")
    
    try:
        request.user.auth_token.delete()
        logger.info(f"User logged out successfully: {user_email}")
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Logout error for {user_email}: {str(e)}")
        return Response({
            'message': 'Error logging out'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def profile(request):
    """Get user profile"""
    user_email = getattr(request.user, 'email', 'unknown')
    logger.info(f"Profile request for user: {user_email}")
    
    try:
        serializer = UserSerializer(request.user)
        return Response({
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Profile retrieval error for {user_email}: {str(e)}")
        return Response({
            'message': 'Error retrieving profile'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def check_email(request):
    """Check if email exists and return temp password if user has one"""
    email = request.data.get('email', '')
    
    if not email:
        return Response({
            'exists': False
        }, status=status.HTTP_200_OK)
    
    try:
        user = User.objects.get(email=email)
        
        # Only return temp password info if:
        # 1. User is not staff (tenant)
        # 2. User has temporary password
        if not user.is_staff and user.has_temporary_password:
            return Response({
                'exists': True,
                'has_temp_password': True,
                'is_staff': False
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'exists': True,
                'has_temp_password': False,
                'is_staff': user.is_staff
            }, status=status.HTTP_200_OK)
            
    except User.DoesNotExist:
        return Response({
            'exists': False
        }, status=status.HTTP_200_OK)