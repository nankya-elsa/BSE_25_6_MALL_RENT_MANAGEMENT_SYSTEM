from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from .models import User
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
    """Login user"""
    email = request.data.get('email', 'unknown')
    logger.info(f"Login attempt for email: {email}")
    
    try:
        user = User.objects.get(email=email)
        if user.check_password(request.data.get('password')):
            user_data = UserSerializer(user).data
            logger.info(f"Successful login for user: {email}")
            return Response({
                'message': 'Login successful',
                'user': user_data,
            }, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Failed login attempt - invalid password for: {email}")
            return Response({
                'message': 'Invalid credentials'
            }, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        logger.warning(f"Failed login attempt - user not found: {email}")
        return Response({
            'message': 'Invalid credentials'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Login error for {email}: {str(e)}")
        return Response({
            'message': 'Internal server error'
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