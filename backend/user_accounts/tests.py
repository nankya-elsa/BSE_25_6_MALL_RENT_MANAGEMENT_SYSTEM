from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class UserAccountsTests(TestCase):
    """Test suite for user authentication endpoints"""
    
    def setUp(self):
        """Set up test client and test user"""
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.logout_url = '/api/auth/logout/'
        self.profile_url = '/api/auth/profile/'
        
        # Test user data with all required fields
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password_confirm': 'testpass123',  # Required by serializer
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '0700123456'  # Required by serializer
        }
    
    def test_user_registration(self):
        """Test that a user can register successfully"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], self.user_data['email'])
    
    def test_user_login(self):
        """Test that a user can login successfully"""
        # First register a user
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Then try to login with EMAIL (not username)
        login_data = {
            'email': self.user_data['email'],  # Changed from username to email
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('user', response.data)
    
    def test_invalid_login(self):
        """Test login with wrong credentials"""
        invalid_data = {
            'email': 'wrong@example.com',
            'password': 'wrongpass'
        }
        response = self.client.post(self.login_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400)
    
    def test_register_duplicate_email(self):
        """Test that registering with duplicate email fails"""
        # Register first user
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Try to register again with same email
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('errors', response.data)
    
    def test_register_password_mismatch(self):
        """Test that registration fails when passwords don't match"""
        invalid_data = self.user_data.copy()
        invalid_data['password_confirm'] = 'differentpassword'
        
        response = self.client.post(self.register_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('errors', response.data)
    
    def test_register_missing_required_fields(self):
        """Test that registration fails with missing fields"""
        incomplete_data = {
            'email': 'test2@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(self.register_url, incomplete_data, format='json')
        self.assertEqual(response.status_code, 400)