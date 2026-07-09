from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Brand, Category, Vehicle 


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "country"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class VehicleSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    brand_country = serializers.CharField(source="brand.country", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model=Vehicle
        fields = [
            "id",
            "brand",
            "brand_name",
            "brand_country",
            "category",
            "category_name",
            "name",
            "price",
            "fuel_type",
            "transmission",
            "top_speed",
            "horsepower",
            "country_of_origin",
            "year",
            "description",
            "created_at",
        ]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value
    
    def validate_year(self, value):
        if value > 2026:
            raise serializers.ValidationError("Year must be less than or equal to 2026.")
        return value


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )