from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from django.db import transaction
from django.utils import timezone
from datetime import datetime
from dateutil.relativedelta import relativedelta


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'phone_number', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        print("Validated data:", validated_data)  # Debug print
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)  # Create user instance first
        user.set_password(password)
        user.save()
        print("User created:", user)  # Debug print
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'user_type', 'full_name', 'created_at']
        read_only_fields = ['id', 'created_at']


class AdminTenantRegistrationSerializer(serializers.Serializer):
    """
    Serializer for admin to register a tenant
    Admin provides basic info, tenant sets password on first login
    """
    # Basic tenant information
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)
    
    # Shop assignment - can be multiple shops
    shop_numbers = serializers.ListField(
        child=serializers.CharField(max_length=10),
        help_text="List of shop numbers to assign to this tenant"
    )
    
    # Date tenant joins (defaults to today if not provided)
    join_date = serializers.DateField(required=False)
    
    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists")
        return value
    
    def validate_username(self, value):
        """Check if username already exists"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists")
        return value
    
    def validate_shop_numbers(self, value):
        """
        Validate that:
        1. All shop numbers exist
        2. None of the shops are already occupied
        """
        from shops.models import Shop
        
        if not value:
            raise serializers.ValidationError("At least one shop must be assigned")
        
        for shop_num in value:
            try:
                shop = Shop.objects.get(shop_number=shop_num)
                if shop.is_occupied:
                    raise serializers.ValidationError(
                        f"Shop {shop_num} is already occupied by {shop.tenant.full_name}"
                    )
            except Shop.DoesNotExist:
                raise serializers.ValidationError(f"Shop {shop_num} does not exist")
        
        return value
    
    def create(self, validated_data):
        """
        Create tenant user and assign shops with proper initial balance and due date
        """
        from shops.models import Shop
        import secrets
        
        # Extract shop numbers before creating user
        shop_numbers = validated_data.pop('shop_numbers')
        join_date = validated_data.pop('join_date', None)
        
        # Generate a temporary random password (tenant will change on first login)
        temp_password = secrets.token_urlsafe(16)
        
        # Use transaction.atomic to ensure everything succeeds or rolls back
        with transaction.atomic():
            # Create the user
            user = User(
                email=validated_data['email'],
                username=validated_data['username'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                phone_number=validated_data.get('phone_number', ''),
                user_type='tenant',
                is_active=True
            )

            # Set date_joined if provided
            if join_date:
                user.date_joined = timezone.make_aware(
                    datetime.combine(join_date, datetime.min.time())
                )

            user.set_password(temp_password)
            user.save()

            # Force a refresh to ensure the user ID is available
            user.refresh_from_db()
            
            # Calculate initial due date (1 month from join date)
            initial_due_date = user.date_joined.date() + relativedelta(months=1)
        
            # Assign shops to this tenant with proper initialization
            assigned_shops = []
            for shop_num in shop_numbers:
                shop = Shop.objects.get(shop_number=shop_num)
                shop.tenant = user
                shop.is_occupied = True
                
                # Initialize payment tracking
                shop.total_paid = 0
                shop.balance = shop.monthly_rent  # Initial balance is the monthly rent
                shop.next_due_date = initial_due_date  # Due 1 month from join date
                
                shop.save()
                assigned_shops.append(shop)
        
        # Return user with additional info
        return {
            'user': user,
            'assigned_shops': assigned_shops,
            'temp_password': temp_password  # Admin should give this to tenant
        }