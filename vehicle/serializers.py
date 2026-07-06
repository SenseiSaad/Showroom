from rest_framework import serializers

from .models import Vehicle 

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Vehicle
        fields="__all__"

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value
    
    def validate_year(self, value):
        if value > 2026:
            raise serializers.ValidationError("Year must be less than or equal to 2026.")
        return value