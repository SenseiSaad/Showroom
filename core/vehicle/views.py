from re import search

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Brand, Category, Vehicle
from .serializers import (
    BrandSerializer,
    CategorySerializer,
    VehicleSerializer,
    UserRegistrationSerializer,
)
from .pagination import CustomPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import permission_classes


@api_view(['GET'])
def view(request, id):
    vehicle=get_object_or_404(Vehicle, id=id)
    serializer=VehicleSerializer(vehicle)
    return Response(serializer.data)

@api_view(['GET'])

def all(request):
    queryset=Vehicle.objects.all()
    brand=request.query_params.get("brand")
    horse_power=request.query_params.get("horsepower")
    speed=request.query_params.get("top_speed")
    year_manuf=request.query_params.get("year")
    origin=request.query_params.get("country_of_origin")
    prices=request.query_params.get("price")
    names=request.query_params.get("name")

    if brand:
        queryset=queryset.filter(brand__name__iexact=brand)
    if horse_power:
        queryset=queryset.filter(horsepower__gte=horse_power)
    if speed:
        queryset=queryset.filter(top_speed__gte=speed)
    if year_manuf:
        queryset=queryset.filter(year__gte=year_manuf)
    if origin:
        queryset=queryset.filter(country_of_origin__iexact=origin)
    if prices:
        queryset=queryset.filter(price__lte=prices)
    if names:
        queryset=queryset.filter(name__icontains=names)
    

    pagination=CustomPagination()
    paginated_vehicle=pagination.paginate_queryset(queryset, request)
    serializer=VehicleSerializer(paginated_vehicle, many=True)
    return pagination.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])

def create(request):
    serializer=VehicleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])

def update(request, id):
    vehicle=get_object_or_404(Vehicle, id=id)
    serializer=VehicleSerializer(vehicle ,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])

def delete(request,id):
    vehicle=get_object_or_404(Vehicle, id=id)
    vehicle.delete()
    return Response({'message':'deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
