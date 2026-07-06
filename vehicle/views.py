from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Vehicle
from .serializers import VehicleSerializer

@api_view(['GET'])
def view(request, id):
    vehicle=get_object_or_404(Vehicle, id=id)
    serializer=VehicleSerializer(vehicle)
    return Response(serializer.data)

@api_view(['GET'])
def all(request):
    vehicle=Vehicle.objects.all()
    serializer=VehicleSerializer(vehicle, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create(request):
    serializer=VehicleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update(request, id):
    vehicle=get_object_or_404(Vehicle, id=id)
    serializer=VehicleSerializer(vehicle ,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete(request,id):
    vehicle=get_object_or_404(Vehicle, id=id)
    vehicle.delete()
    return Response({'message':'deleted'}, status=status.HTTP_204_NO_CONTENT)
