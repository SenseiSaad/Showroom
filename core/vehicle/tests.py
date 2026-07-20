from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from core.vehicle.models import Brand, Category, Vehicle
from core.vehicle.serializers import UserRegistrationSerializer, VehicleSerializer



class VehicleTestCase(APITestCase):
    def setUp(self):
        self.brand = Brand.objects.create(name="Toyota", country="Japan")
        self.category = Category.objects.create(name="Sedan")
        self.vehicle = Vehicle.objects.create(
            brand=self.brand,
            category=self.category,
            name="Toyota Camry",
            price=25000.00,
            fuel_type="Petrol",
            transmission="Automatic",
            top_speed=130,
            horsepower=200,
            country_of_origin="Japan",
            year=2020,
            description="A reliable and comfortable sedan.",
        )

    def vehicle_payload(self, **overrides):
        data = {
            "brand": self.brand.id,
            "category": self.category.id,
            "name": "Toyota Corolla",
            "price": "22000.00",
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "top_speed": 120,
            "horsepower": 180,
            "country_of_origin": "Japan",
            "year": 2022,
            "description": "A compact sedan.",
        }
        data.update(overrides)
        return data

    def test_brand_str(self):
        self.assertEqual(str(self.brand), "Toyota")

    def test_category_str(self):
        self.assertEqual(str(self.category), "Sedan")

    def test_vehicle_str(self):
        self.assertEqual(str(self.vehicle), "Toyota Camry")

    def test_vehicle_serializer_returns_read_only_related_fields(self):
        serializer = VehicleSerializer(self.vehicle)

        self.assertEqual(serializer.data["brand_name"], "Toyota")
        self.assertEqual(serializer.data["brand_country"], "Japan")
        self.assertEqual(serializer.data["category_name"], "Sedan")

    def test_vehicle_serializer_rejects_negative_price(self):
        serializer = VehicleSerializer(data=self.vehicle_payload(price="-1.00"))

        self.assertFalse(serializer.is_valid())
        self.assertIn("price", serializer.errors)

    def test_vehicle_serializer_rejects_future_year(self):
        serializer = VehicleSerializer(data=self.vehicle_payload(year=2027))

        self.assertFalse(serializer.is_valid())
        self.assertIn("year", serializer.errors)

    def test_vehicle_list_returns_paginated_results(self):
        category = Category.objects.create(name="SUV")
        for index in range(5):
            Vehicle.objects.create(
                brand=self.brand,
                category=category,
                name=f"Vehicle {index}",
                price=10000 + index,
                fuel_type="Petrol",
                transmission="Automatic",
                top_speed=110 + index,
                horsepower=150 + index,
                country_of_origin="Japan",
                year=2021,
                description="Test vehicle",
            )

        response = self.client.get(reverse("all-vehicles"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertEqual(len(response.data["results"]), 5)
        self.assertEqual(response.data["count"], 6)

    def test_vehicle_list_filter_by_brand_and_name(self):
        honda = Brand.objects.create(name="Honda", country="Japan")
        suv = Category.objects.create(name="SUV")
        Vehicle.objects.create(
            brand=honda,
            category=suv,
            name="Honda Civic",
            price=21000,
            fuel_type="Petrol",
            transmission="Automatic",
            top_speed=125,
            horsepower=170,
            country_of_origin="Japan",
            year=2021,
            description="Compact car",
        )

        response = self.client.get(
            reverse("all-vehicles"),
            {"brand": "Honda", "name": "civic"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Honda Civic")

    def test_vehicle_detail_returns_one_vehicle(self):
        response = self.client.get(reverse("vehicle-detail", args=[self.vehicle.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.vehicle.id)
        self.assertEqual(response.data["name"], "Toyota Camry")

    def test_create_vehicle_requires_authentication(self):
        response = self.client.post(reverse("create-vehicle"), self.vehicle_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_vehicle_success_for_authenticated_user(self):
        user = User.objects.create_user(username="user1", password="strong-pass-123")
        self.client.force_authenticate(user=user)

        response = self.client.post(reverse("create-vehicle"), self.vehicle_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vehicle.objects.count(), 2)
        self.assertEqual(response.data["name"], "Toyota Corolla")

    def test_update_vehicle_requires_admin(self):
        user = User.objects.create_user(username="user2", password="strong-pass-123")
        self.client.force_authenticate(user=user)

        response = self.client.put(
            reverse("update-vehicle", args=[self.vehicle.id]),
            self.vehicle_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_vehicle_success_for_admin(self):
        admin = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="strong-pass-123",
        )
        self.client.force_authenticate(user=admin)

        payload = self.vehicle_payload(name="Toyota Supra", year=2024)
        response = self.client.put(reverse("update-vehicle", args=[self.vehicle.id]), payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.name, "Toyota Supra")
        self.assertEqual(self.vehicle.year, 2024)

    def test_delete_vehicle_success_for_admin(self):
        admin = User.objects.create_superuser(
            username="admin2",
            email="admin2@example.com",
            password="strong-pass-123",
        )
        self.client.force_authenticate(user=admin)

        response = self.client.delete(reverse("delete-vehicle", args=[self.vehicle.id]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Vehicle.objects.count(), 0)

    def test_register_user_creates_account(self):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "strong-pass-123",
        }

        response = self.client.post(reverse("register-user"), payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], "newuser")
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_user_rejects_short_password(self):
        serializer = UserRegistrationSerializer(
            data={"username": "tiny", "email": "tiny@example.com", "password": "short"}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

