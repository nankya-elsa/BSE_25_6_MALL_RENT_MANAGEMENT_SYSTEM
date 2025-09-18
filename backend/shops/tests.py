# Create your tests here.
from django.test import TestCase
from .models import Shop

class ShopModelTest(TestCase):
    def test_create_shop(self):
        shop = Shop.objects.create(
            shop_number="A101",
            monthly_rent=500.00,
        )
        self.assertEqual(shop.shop_number, "A101")
        self.assertEqual(float(shop.monthly_rent), 500.00)
        self.assertFalse(shop.is_occupied)  # default is False
