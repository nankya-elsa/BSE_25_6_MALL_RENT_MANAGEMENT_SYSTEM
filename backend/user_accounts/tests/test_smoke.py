from django.test import TestCase


class SmokeTest(TestCase):
    def test_django_loads(self):
        """A simple smoke test to ensure Django starts and the test runner discovers tests."""
        self.assertTrue(True)
